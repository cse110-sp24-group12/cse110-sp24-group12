---
# Why we chose electron ADR
status: "accepted"
date: 2024/05/12
deciders: Lindsey Rappaport, Ramtin Tajbakhsh, Jordan Chang, Matthew Williams, Sophia Davis, Eban Covarrubias, Guan Huang Chen, Ibraheem Syed, Ritvik Penchala, Sidhant Singhvi, Wen Hsin Chang
informed: Jash Makhija
---
# Why we chose electron

## Context and Problem Statement  

The decision to adopt Electron as the platform for our  application development needs to be formally documented to provide clarity on the reasoning behind this choice.

## Considered alternates
1. Sciter.JS
2. React Native
3. electrino
4. NW.js
5. Avalonia

## Decision drivers

**Key factors considered:**

1. **Cross-Platform Compatibility:**
   - Facilitates the development of applications that are compatible with multiple operating systems, including Windows, macOS, and Linux. This ensures broad accessibility for our users across diverse environments.

2. **Utilization of Web Technologies:**
   - By leveraging web technologies such as HTML, CSS, and JavaScript, it should allow our team to build desktop applications using familiar tools and methodologies. This familiarity accelerates the development process and promotes code reuse.

3. **Extensive Ecosystem:**
   - Offers a rich ecosystem of libraries, frameworks, and tools that augment the development workflow. This ecosystem includes widely adopted frameworks like React and Vue.js, as well as robust packaging and distribution utilities.

4. **Offline Capabilities:**
   - Ability to provide offline functionality through local file access. This capability enables our applications to operate seamlessly without an internet connection, ensuring uninterrupted user experiences.

## Decision outcome
Chosen option: Electron, because it provides a robust framework for building cross-platform desktop applications using familiar web technologies like HTML, CSS, and JavaScript. Electron's extensive ecosystem, including libraries and tools, supports rapid development and enhances productivity. Additionally, Electron's offline functionality through local file access ensures seamless user experiences, which is crucial for our project requirements. While Electron may have some drawbacks, such as higher memory usage and larger application size, its benefits outweigh these concerns for our use case.

## Consequences
Good: Electron offers a comprehensive solution for desktop application development, leveraging web technologies. It also provides a rich ecosystem with support for extensions and plugins, enhancing development flexibility and productivity. 
Bad: Electron may not provide control over elements compared to native development approaches.

## Pros of using electron
   - Simplified development with familiar web technologies.
    
   - Broad compatibility across multiple operating systems.
    
   - Access to a thriving ecosystem of tools and libraries.
    
   - Offline functionality for enhanced user experience.

## Cons of Using Electron:
   - Increased memory consumption compared to native applications.
   
   - Larger application footprint due to bundled Chromium and Node.js runtimes.
   
   - Limited access to low-level system resources in comparison to native development approaches.

## Comparison with Traditional Client/Server Approach
Electron's approach to local file access contrasts with the traditional client/server model:

- **Electron:**
  - Electron applications are self-contained and run locally on users' devices, granting direct access to the file system. This architecture simplifies data management and retrieval, making it suitable for offline scenarios.

- **Traditional Client/Server:**
  - In the traditional client/server paradigm, applications communicate with remote servers to execute CRUD operations. While this approach offers centralized data management and scalability, it relies on network connectivity and may not perform optimally in offline environments.

## Conclusion
Considering the imperative of cross-platform compatibility, the familiarity and efficiency of web technologies, and the imperative of offline functionality, Electron emerges as the optimal choice for our desktop application development endeavors. While acknowledging its associated challenges, the benefits afforded by Electron align closely with our project objectives and strategic priorities.

## References

- Electron Documentation: [https://www.electronjs.org/docs](https://www.electronjs.org/docs)
- "Electron in Action" by Steve Kinney, Manning Publications.
