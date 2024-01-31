export class TaskAlreadyExistsError extends Error {
  constructor() {
    super('Tasks already exists')
  }
}
