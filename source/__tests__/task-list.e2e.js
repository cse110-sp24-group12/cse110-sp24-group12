import { test, expect, _electron as electron } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const TASKLIST_FILE_PATH = path.join('data', 'tasklist', 'tasks.json');

// Function to clear the contents of password.json
const clearTaskListFile = () => {
    fs.writeFileSync(TASKLIST_FILE_PATH, '[]');
};

test.describe('Task List E2E Tests', () => {
    let window, electronApp;

    test.beforeAll(async () => {
        electronApp = await electron.launch({ 
            args: ['.'],
            env: {
                ...process.env,
                NODE_ENV: 'development'
            }
        });
        window = await electronApp.firstWindow();
        await window.waitForTimeout(500);
        await window.evaluate(async () => {
            await window.api.loadHtmlFile('calendar.html');
        });
        clearTaskListFile();
        await window.waitForTimeout(500);
    });

    test.afterAll(async () => {
        await electronApp.close();
    });

    test('Add task', async () => {
        const button = await window.$('#taskListBtn');
        await button.click();

        const taskInput = await window.$('#taskInput');
        await taskInput.fill('Test Task');

        const priorityInput = await window.$('#priorityInput');
        await priorityInput.selectOption('high');

        const addButton = await window.$('#addBtn');
        await addButton.click();

        const taskItems = await window.$$('.task-item');
        expect(taskItems).toHaveLength(1);

        const label = await taskItems[0].$('label');
        const labelText = await label.textContent();
        expect(labelText).toBe('Test Task');
    });

    test('Add another task', async () => {
        const taskInput = await window.$('#taskInput');
        await taskInput.fill('Another Test Task');

        const priorityInput = await window.$('#priorityInput');
        await priorityInput.selectOption('low');

        const addButton = await window.$('#addBtn');
        await addButton.click();

        const taskItems = await window.$$('.task-item');
        expect(taskItems).toHaveLength(2);

        const label = await taskItems[1].$('label');
        const labelText = await label.textContent();
        expect(labelText).toBe('Another Test Task');
    });

    test('edit task', async () => {
        const taskItems = await window.$$('.task-item');
        const editButton = await taskItems[0].$('.edit-button');
        await editButton.click();

        const taskInput = await window.$('#editTaskInput');
        await taskInput.fill('Edited Task');

        const priorityInput = await window.$('#editPriorityInput');
        await priorityInput.selectOption('Medium');

        const saveButton = await window.$('#saveBtn');
        await saveButton.click();

        await window.waitForTimeout(100);
        const taskItems1 = await window.$$('.task-item');
        const label = await taskItems1[0].$('label');
        const labelText = await label.textContent();
        expect(labelText).toBe('Edited Task');
    });

    test('Add task with no name', async () => {
        const taskInput = await window.$('#taskInput');
        await taskInput.fill('');

        const priorityInput = await window.$('#priorityInput');
        await priorityInput.selectOption('medium');

        const addButton = await window.$('#addBtn');
        await addButton.click();

        const taskItems = await window.$$('.task-item');
        expect(taskItems).toHaveLength(2);
    });

    test('Delete task', async () => {
        const taskItems = await window.$$('.task-item');
        const deleteButton = await taskItems[0].$('.delete-button');
        await deleteButton.click();

        const taskItems1 = await window.$$('.task-item');
        expect(taskItems1).toHaveLength(1);
    });

    test('Adding task after deleting', async () => {
        const taskInput = await window.$('#taskInput');
        await taskInput.fill('New Task After Delete');

        const priorityInput = await window.$('#priorityInput');
        await priorityInput.selectOption('high');

        const addButton = await window.$('#addBtn');
        await addButton.click();

        const taskItems = await window.$$('.task-item');
        expect(taskItems).toHaveLength(2);
    });

    test('Delete all tasks', async () => {
        await window.$$eval('.delete-button', (buttons) => {
            buttons.forEach((button) => button.click());
        });

        const tasks = await window.$$('.task-item');
        expect(tasks).toHaveLength(0);
    });
});