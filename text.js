const foodlogs = [{
    tp: "morning",
    n: {
        f: 200, 
        c: 10000
    }
}, {
    tp: "morning",
    n: {
        f: 100, 
        c: 5000
    }
}, {
    tp: "noon",
    n: {
        f: 100, 
        c: 5000
    }
}]

const result = foodlogs.reduce((acc, curr) => {
    acc[curr.tp].f = (acc[curr.tp].f || 0) + curr.n.f
    acc[curr.tp].c = (acc[curr.tp].c || 0) + curr.n.c
    return acc;
}, {morning: {}, noon: {}})

console.log(result);