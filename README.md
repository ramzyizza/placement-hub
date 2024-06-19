## Overview

PlacementHub is a centralized platform designed to simplify placement management for students. Developed using JHipster with an Angular framework, PlacementHub integrates eight vertically sliced features into a coherent web application accessible on laptops, phones, and tablets. Key features include a Dashboard and Placement Listing, Placement Kanban Tracker, Calendar, Notes Area, Ratings Page, Article and Video Resource Page, Company Profile, and an AI Chatbot.

## Features

### Dashboard and Placement Listing (Developed by Ramzy)
My Features Demo Video: [Click Here](https://drive.google.com/file/d/1CbcLrl23Z0DvqKIxXO6s7_ZvcOSvXEC3/view?usp=sharing)

**Dashboard:** Displays a summary of the user’s application progress, dynamically loading application status from the database.

![image](https://github.com/ramzyizza/Functional-Programming-with-Haskell/assets/89899122/6869da8a-5aee-4d14-945f-04fe0f68f97c)


**Placement Listing:** Allows users to explore the latest placement opportunities by searching for roles or company names. Clicking on a placement provides more details in a pop-up.

![87103da1-593a-41a6-a667-74abf6f1650c](https://github.com/ramzyizza/Functional-Programming-with-Haskell/assets/89899122/b0cd0e65-6239-4f6c-b296-8e484c5f367c)

![image](https://github.com/ramzyizza/Functional-Programming-with-Haskell/assets/89899122/1f2cc344-5c05-4799-a845-686aff3432df)
![image](https://github.com/ramzyizza/Functional-Programming-with-Haskell/assets/89899122/28e4ee48-234a-47c1-9e32-d0b40f4b0374)

### Placement Kanban Tracker (Developed by Shravni)

A Kanban board tool for tracking placement applications through six stages of the application process. Users can drag and drop application cards between columns, add new cards, and edit or delete existing cards.

![image](https://github.com/ramzyizza/Functional-Programming-with-Haskell/assets/89899122/3b73a65a-a81c-4154-bdee-56f9632b407e)


### Calendar (Developed by Laila)

The Calendar feature helps users keep track of events like interviews and assessment centers. It includes monthly, weekly, and daily views, with an option to add, edit, or delete events. A smaller monthly overview and a section for user-created calendars facilitate easy navigation and management.
![image](https://github.com/ramzyizza/Functional-Programming-with-Haskell/assets/89899122/3d1aa925-b218-4277-91d7-03219521f8b9)


### Ratings Page (Developed by Katarina)

Users can view and search reviews written by other students. Logged-in users can write reviews by submitting their feedback on the ‘Share Experience’ page.

![image](https://github.com/ramzyizza/Functional-Programming-with-Haskell/assets/89899122/11efb091-1dd5-4105-ac27-de293e5e160a)



## And Many Exciting Features Below!

### Notes Area (Developed by Suhel)

Allows users to take and organize notes about their placements or company research. Features include text formatting, image insertion, and quick deletion options.

### Articles and Videos (Developed by Chibueze)

Provides users with informational resources related to interviews and job applications. Includes functionality to favorite articles and videos for logged-in users, and a filter section for specific topics.

### Company Profile (Developed by Andre)

Lists registered companies with their profiles. Users can view company posts and profiles, while companies can manage their posts and placements via a company dashboard.

### AI Chatbot (Developed by Chibueze)

Enables users to navigate the application using keyboard and voice commands. The AI Chatbot processes voice commands and redirects users to the desired pages. Keyboard shortcuts are provided for quick access.

## Team Project

This application was generated using JHipster 7.9.4. Documentation and support are available at the [JHipster Documentation Archive](https://www.jhipster.tech/documentation-archive/v7.9.4).

### Team Members

- Ramzy Izza Wardhana
- Laila Tantavy
- Chibueze David Ogbonna
- Katarina Keishanti Joanne Kartakusuma
- Shravni Kulkarni
- Andrei Argeanu
- Suhel Malik

### Changes for Team Project

Modified by Madasar Shah for Team Project:
- Configuration changes in `.yo-rc.json` and `pom.xml`
- Footer text updated in `footer.component.html`
- CI/CD pipeline setup in `.gitlab-ci.yml`
- Docker deployment scripts and configurations added

## Development Environment Setup

### Prerequisites

- Java JDK
- Apache Maven
- Node.js and npm

### Installing Dependencies

```sh
npm install
```

### Running the Development Servers

In separate terminals, run:
```sh
./mvnw
npm start
```

### Managing Dependencies

To add a library, run:
```sh
npm install --save --save-exact <library-name>
```

### Progressive Web App (PWA) Support

Enable the service worker by uncommenting the code in `src/main/webapp/app/app.module.ts`:
```ts
ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
```

### Using Angular CLI

To generate a new component, run:
```sh
ng generate component my-component
```

### JHipster Control Center

Start the control center with:
```sh
docker-compose -f src/main/docker/jhipster-control-center.yml up
```

### Building for Production

#### Packaging as a JAR

Run:
```sh
./mvnw -Pprod clean verify
java -jar target/*.jar
```

#### Packaging as a WAR

Run:
```sh
./mvnw -Pprod,war clean verify
```

## Testing

Run the tests with:
```sh
./mvnw verify
npm test
```

## Code Quality

Start a local Sonar server with:
```sh
docker-compose -f src/main/docker/sonar.yml up -d
```
Run a Sonar analysis with:
```sh
./mvnw -Pprod clean verify sonar:sonar
```

## Using Docker

Start a PostgreSQL database in a Docker container with:
```sh
docker-compose -f src/main/docker/postgresql.yml up -d
```
Build and run the Docker image of the app with:
```sh
npm run java:docker
docker-compose -f src/main/docker/app.yml up -d
```

## Continuous Integration

Configure CI for your project with the ci-cd sub-generator:
```sh
jhipster ci-cd
```
For more details, refer to the [Continuous Integration documentation](https://www.jhipster.tech/setting-up-ci/).
