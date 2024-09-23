export class AddTask {
    static readonly type = '[Task] Add';
    constructor(public payload: any) {}
  }
  
  export class UpdateTask {
    static readonly type = '[Task] Update';
    constructor(public id: number, public payload: any) {}
  }
  
  export class DeleteTask {
    static readonly type = '[Task] Delete';
    constructor(public id: number) {}
  }
  
  export class GetTaskList {
    static readonly type = '[Task] Get List';
  }
  