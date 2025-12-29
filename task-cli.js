//2025/12/28
// Creater: YiLinDai
// Address: 
// Language: Javascript
// Version: Node.js (v20.12.2)
// GitHub: https://github.com/itoeHi/CLI-Task-tracker-Manager.git
// Notice: ALL this project is one of the practice project from roadmap: https://roadmap.sh/projects/task-tracker


const taskStroage = 'task.json';
const fs = require('fs')
const path = require('path');
const { parseArgs } = require('util');
const { deserialize } = require('v8');

class Task {
    constructor(id, description) {
        this.id = id;
        this.description = description;
        this.status = 'todo';
        this.createAt = new Date().toISOString();
        this.updateAt = this.createAt;
    }

    updateDescription(newDescription) {
        this.description = newDescription;
        this.updateAt = new Date().toISOString();
    }

    markAs(status) {
        if (['todo', 'in-progress', 'done'].includes(status)) {
            this.status = status;
            this.updateAt = new Date().toISOString();
            return true;
        }
        return false;
    }

    toString() {
        const createdTime = new Date(this.createAt).toLocaleString();
        const updatedTime = new Date(this.updateAt).toLocaleString();
        return `ID: ${this.id} | "${this.description}" | Status: ${this.status} | Created: ${createdTime} | Updated: ${updatedTime}`;
    }
}

class TaskManager {
    constructor() {
        this.tasks = [];
        this.dataFile = path.join(__dirname, taskStroage);
        this.ensureDataFileExists();
        this.loadTasks();
    }

    ensureDataFileExists() {
        try {
        if (!fs.existsSync(this.dataFile)) {
            // JSON file does not exist, create an new empty file 'task.json'
            fs.writeFileSync(this.dataFile, JSON.stringify([], null, 2));
            console.log('Created new tasks.json file.');
        }
        } catch (error) {
        console.error('Error creating data file:', error.message);
        process.exit(1);
        }
    }

    loadTasks() {
        try {
            const data = fs.readFileSync(this.dataFile, 'utf8');

            // JSON file had no task
            if (!data.trim()) {
                this.tasks = [];
                this.saveTasks();
                console.log('No Task exist!');
                return;
            }
            
            const tasksData = JSON.parse(data);

            this.tasks = tasksData.map(taskData => {
                const task = new Task(taskData.id, taskData.description);
                task.status = taskData.status;
                task.createAt = taskData.createAt;
                task.updateAt = taskData.updateAt;
                return task;
        });
        } catch (error) {
            // If JSON file corrupted, start again to create empty JSON file
            if (error instanceof SyntaxError) {
                console.error('Error: tasks.json contains invalid JSON. Creating a new empty file.');
                this.backupCorruptedFile();
                this.tasks = [];
                this.saveTasks();
            } else {
                console.error('Error loading tasks:', error.message);
                process.exit(1);
            }
        }
    }

    saveTasks() {
        try {
            const tasksData = this.tasks.map(task => ({
                id: task.id,
                description: task.description,
                status: task.status,
                createAt: task.createAt,
                updateAt: task.updateAt
            }));
            fs.writeFileSync(this.dataFile, JSON.stringify(tasksData, null, 2));
        } catch (error) {
            console.error('Error saving tasks: ', error.message);
            process.exit(1);
        }
    }

    getNextId() {
        if (this.tasks.length === 0) return 1;
        const maxId = Math.max(...this.tasks.map(task => task.id));
        return maxId + 1;
    }

    findTaskById(id) {
        return this.tasks.find(task => task.id === id);
    }

    addTask(description) {
        if (!description || description.trim() === '') {
            throw new Error(`Task description cannot ne empty`);
        }

        const newid = this.getNextId();
        const task = new Task(newid, description.trim());
        this.tasks.push(task);
        this.saveTasks();
        console.log(`Task added successfully (ID: ${newid})`);
        return task;
    }

    updateTask(id, newDescription) {
        if (!newDescription || newDescription.trim() === '') {
            throw new Error(`Task description cannot be empty`);
        }

        const TaskId = parseInt(id, 10);
        if (isNaN(TaskId)) {
            throw new Error(`Invalid task ID: ${id}`);
        }

        const task = this.findTaskById(TaskId);
        if(!task) {
            throw new Error(`Task with ID ${id} not found`);
        }

        console.log(`upDateTask: ${JSON.stringify(task)}`);                
        console.log(`NewDescription: ${newDescription}`);                  

        task.updateDescription(newDescription.trim());

        console.log(`upDateTask: ${JSON.stringify(task)}`);               

        this.saveTasks();
        console.log(`Task updated successfully (ID: ${id})`);
        return task;
    }

    deleteTask(id) {
        const taskId = parseInt(id, 10);
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);

        if(taskIndex === -1) {
            throw new Error(`Task with ID ${id} not found`);
        }

        this.tasks.splice(taskIndex, 1);
        this.saveTasks();
        console.log(`Task deleted successfully (ID: ${id})`);
    }

    markTask(id, status) {
        const task = this.findTaskById(parseInt(id, 10));
        if(!task) {
            throw new Error(`Task with ID ${id} not found`);
        }

        if (!task.markAs(status)) {
            throw new Error(`Invalid status. Use 'todo', 'in-progress', or 'done'`);
        }

        this.saveTasks();
        console.log(`Task marked as ${status} (ID: ${id})`);
        return task;
    }

    listTasks(statusFilter) {
        let tasksToDisplay = this.tasks;

        if(statusFilter) {
            if (!['todo', 'in-progress', 'done'].includes(statusFilter)) {
                throw new Error(`Invalid status filter. Use 'todo', 'in-progress', or 'done'`);
            }
            tasksToDisplay = this.tasks.filter(task => task.status === statusFilter);
        }

        //No task exist
        if(tasksToDisplay.length === 0) {
            if(statusFilter == undefined) {
                console.log('No tasks existed. You can use add "task-description" to add new task');
            }
            return;
        }

        console.log('\nTasks:');
        tasksToDisplay.forEach(task => {
            console.log(`  ${task.toString()}`);
        });
        console.log('');
        this.saveTasks();
    }
}

//CLI Interface
function printUsage() {
    console.log('Task CLI - Task Management System');
    console.log('Usage: ');
    console.log('    task-cli add "task-description" - Add task (default status is "todo")')
    console.log('    task-cli update <id> "desc" - Update task description');
    console.log('    task-cli delete <id> - Delete a task');
    console.log('    task-cli mark-in-progress <id> - Mark task as in-progress');
    console.log('    task-cli mark-done <id> - Mark task as done');
    console.log('    task-cli list <status> - List tasks by status (todo/in-porgress/done)');
    console.log('');
    console.log('Examples: ');
    console.log('    task-cli add "Buy grocries"');
    console.log('    task-cli update 1 "Buy groceries and cook dinner"');
    console.log('    task-cli list done');
}

function parseArguments() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        return { command: 'help' };
    }

    const command = args[0];

    switch (command) {
        case 'add' :
            if (args.length < 2) {
                throw new Error('Missing task description');
            }
            return {
                command: 'add',
                description: args.slice(1).join(' ').replace(/^"|"$/g, '')
            };
        case 'update':
            if (args.length < 3) {
                throw new Error('Missing task ID or description');
            }
            return {
                command: 'update',
                id: args[1],
                description: args.slice(2).join(' ').replace(/^"|"$/g, '')
            };
        case 'delete':
            if (args.length < 2) {
                throw new Error('Missing task ID');
            }
            return {
                command: 'delete',
                id: args[1]
            };
        case 'mark-in-progress':
            if (args.length < 2) {
                throw new Error('Missing task ID');
            }
            return {
                command: 'mark',
                id: args[1],
                status: 'in-progress'
            };
        case 'mark-done':
            if (args.length < 2) {
                throw new Error('Missing task ID');
            }
            return {
                command: 'mark',
                id: args[1],
                status: 'done'
            };
        case 'list':
            if (args.length > 1) {
                return {
                    command: 'list',
                    status: args[1]
                };
            }
            return {
                command: 'list'
            };
        default:
            return { command: 'help' };
    }
}

function main() {
    try {
        const taskManager = new TaskManager();
        const parsedArgs = parseArguments();

        //console.log(`parseArguments: ${parsedArgs.command}`);                             //test: Output command-------------->!
        //console.log(`ParseArgs: ${JSON.stringify(parsedArgs)}`)                           //test: Output processed parseArgs-->!

        switch (parsedArgs.command) {
            case 'add':
                taskManager.addTask(parsedArgs.description);
                break;
            case 'update':
                taskManager.updateTask(parsedArgs.id, parsedArgs.description);
                break;
            case 'delete':
                taskManager.deleteTask(parsedArgs.id);
                break;
            case 'mark':
                taskManager.markTask(parsedArgs.id, parsedArgs.status);
                break;
            case 'list':
                taskManager.listTasks(parsedArgs.status);
                break;
            case 'help':
                console.log('Unknown command');
                printUsage();
                process.exit(1);
        }
    } catch (error) {
        console.log('Jump in error-input section');
        console.error('Error: ', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}