export function logger(...args: any) {
    //TODO divide long args and give samples
    if(args.length > 0) {
        console.log(...args.map(arg => String(arg).substring(0,150),"..."));
    }
}