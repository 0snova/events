export type Command<P = any> = {
  type: string;
  payload: P;
};

export class CommandDispatcher<C extends Command<any>> {
  constructor(protected map: Record<string, (...args: any) => any>) {}

  dispatch(command: C) {
    const commandExecutor = this.map[command.type];
    if (!commandExecutor) {
      console.error(`Unrecognized command "${command.type}"`);
    }
    return commandExecutor();
  }
}

export async function initialize() {
  return Promise.resolve({ result: 'success', command: 'initialize' });
}
