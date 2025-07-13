/**
 * Worker Pool for Hebrew Text Normalization
 * 
 * A high-performance worker pool implementation that maintains a fixed number
 * of reusable worker threads for processing text normalization tasks.
 * 
 * @module workerPool
 */

const { Worker } = require('worker_threads');
const os = require('os');
const path = require('path');

/**
 * A hilarious yet efficient worker pool for text normalization.
 * This pool is like a team of linguistics ninjas - they wait silently
 * until called upon, then normalize text with deadly precision.
 */
class WorkerPool {
  /**
   * Creates a new worker pool with a specified number of worker threads.
   * 
   * @param {number} [numWorkers] - Number of workers in the pool (defaults to CPU count)
   * @param {string} [workerScript] - Path to the worker script
   */
  constructor(numWorkers = os.cpus().length, workerScript = path.join(__dirname, 'normalization-worker.js')) {
    this.workerScript = workerScript;
    this.numWorkers = numWorkers;
    this.workers = [];
    this.freeWorkers = [];
    this.taskQueue = [];
    this.initialized = false;
  }

  /**
   * Initializes the worker pool by creating all worker threads.
   * Like preparing your linguistics army before the text battle begins!
   * 
   * @returns {Promise<void>} A promise that resolves when all workers are initialized
   */
  async initialize() {
    if (this.initialized) return;

    // Create all workers at once
    const initPromises = [];
    
    for (let i = 0; i < this.numWorkers; i++) {
      initPromises.push(this._createWorker());
    }
    
    await Promise.all(initPromises);
    this.initialized = true;
  }

  /**
   * Creates a new worker and sets up message handling.
   * 
   * @private
   * @returns {Promise<Worker>} A promise that resolves to the created worker
   */
  _createWorker() {
    return new Promise((resolve) => {
      const worker = new Worker(this.workerScript);
      
      worker.on('message', (result) => {
        // Get the callback for the current task
        const { resolve: taskResolve } = worker.currentTask;
        
        // Mark worker as free
        worker.currentTask = null;
        this.freeWorkers.push(worker);
        
        // Resolve the task promise with the result
        taskResolve(result);
        
        // Process next task in queue if any
        if (this.taskQueue.length > 0) {
          const nextTask = this.taskQueue.shift();
          this._runTask(nextTask);
        }
      });
      
      worker.on('error', (err) => {
        if (worker.currentTask) {
          const { reject: taskReject } = worker.currentTask;
          taskReject(err);
        }
        
        // Replace the failed worker with a new one
        this._replaceWorker(worker);
      });
      
      // Store the worker and mark it as free
      worker.currentTask = null;
      this.workers.push(worker);
      this.freeWorkers.push(worker);
      resolve(worker);
    });
  }

  /**
   * Replaces a failed worker with a new one.
   * Even worker ninjas need backup sometimes!
   * 
   * @private
   * @param {Worker} deadWorker - The worker that needs to be replaced
   */
  async _replaceWorker(deadWorker) {
    // Remove the dead worker from the workers array
    const index = this.workers.indexOf(deadWorker);
    if (index !== -1) {
      this.workers.splice(index, 1);
    }
    
    // Remove from free workers as well
    const freeIndex = this.freeWorkers.indexOf(deadWorker);
    if (freeIndex !== -1) {
      this.freeWorkers.splice(freeIndex, 1);
    }
    
    // Create a new worker to replace the dead one
    try {
      await this._createWorker();
    } catch (error) {
      console.error('Failed to replace worker:', error);
    }
  }

  /**
   * Runs a task on the next available worker.
   * 
   * @private
   * @param {Object} task - The task to run
   */
  _runTask(task) {
    const worker = this.freeWorkers.pop();
    worker.currentTask = task;
    worker.postMessage(task.data);
  }

  /**
   * Executes a task using an available worker from the pool.
   * 
   * @param {*} data - The data to send to the worker
   * @returns {Promise<*>} A promise that resolves with the worker's result
   */
  runTask(data) {
    // Ensure the pool is initialized
    if (!this.initialized) {
      throw new Error('Worker pool not initialized. Call initialize() first.');
    }
    
    return new Promise((resolve, reject) => {
      const task = { data, resolve, reject };
      
      if (this.freeWorkers.length > 0) {
        // If there's a free worker, use it immediately
        this._runTask(task);
      } else {
        // Otherwise, queue the task
        this.taskQueue.push(task);
      }
    });
  }

  /**
   * Gracefully shuts down all workers in the pool.
   * Time for our linguistic ninjas to go home and rest!
   * 
   * @returns {Promise<void>} A promise that resolves when all workers are terminated
   */
  async shutdown() {
    // Create an array of promises for each worker termination
    const terminationPromises = this.workers.map(worker => {
      return new Promise((resolve) => {
        worker.on('exit', () => resolve());
        worker.terminate();
      });
    });
    
    // Wait for all workers to terminate
    await Promise.all(terminationPromises);
    
    // Reset the pool state
    this.workers = [];
    this.freeWorkers = [];
    this.taskQueue = [];
    this.initialized = false;
  }
}

module.exports = WorkerPool;