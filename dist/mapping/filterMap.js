const filterMap = (a, f, ps) => {
    return a.reduce((acc, e) => {
        const passes = ps.every(p => p(e));
        return passes ? [...acc, f(e)] : acc;
    }, []);
};
export default filterMap;
