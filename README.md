# CLI-Task-tracker-Manager

## Intro

This is backend pratice project. Detail Please visit Roadmap.
https://roadmap.sh/projects/task-tracker
## Menu structure

- [Intro](#Intro)
- [Setup](#Setup)
- [Project](#Project)
- [Usage](#Usage)
- [Contribute](#Contribute)
- [Lisence](#Lisence)

## Setup
https://nodejs.org/zh-cn/download
Use cmd command to check if Node.js is installed:
node --version 

## Project

Task tracker is a project used to track and manage your tasks. In this task, you will build a simple command line interface (CLI) to track > what you need to do, what you have done, and what you are currently working on. This project will help you practice your programming skills, including working with the filesystem, handling user inputs, and building a simple CLI application.

### Requirements
The application should run from the command line, accept user actions and inputs as arguments, and store the tasks in a JSON file. The user should be able to:
+ Add, Update, and Delete tasks
+ Mark a task as in progress or done
+ List all tasks
+ List all tasks that are not done
+ List all tasks that are in progress

### Task Properties
Each task should have the following properties:
- **`id`**: A unique identifier for the task
- **`description`**:  A short description of the task
- **`status`**: The status of the task(**·todo·**，**·in-progress·**，**·done·**)
- **`createAt`**: The date and time when the task was created
- **`updateAt`**: The date and time when the task was last updated


## Usage
Terminal Example: (if use node directly, add "node" at front)
```
# Adding a new task
task-cli add "Buy groceries"
# Output: Task added successfully (ID: 1)

# Updating and deleting tasks
task-cli update 1 "Buy groceries and cook dinner"
task-cli delete 1

# Marking a task as in progress or done
task-cli mark-in-progress 1
task-cli mark-done 1

# Listing all tasks
task-cli list

# Listing tasks by status
task-cli list done
task-cli list todo
task-cli list in-progress
```

## Contribute
yilinDai (GitHub name: itoeHi, email:daiyilin1425251132@qq.com)

## Lisence
No lisence
