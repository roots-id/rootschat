export function logger(...args: any) {
    if(args.length > 0) {
        const samples = [];
        args.forEach(arg => {
            const splitArgs = String(arg).split(" ");
            splitArgs.forEach(splitArg => {
                const sampled = splitArg.length > 75;
                const sampleArg = splitArg.substring(0,75);
                samples.push(sampleArg);
                if(sampled) {samples.push("...");}
            });
        })
        console.log(...samples);
    }
}