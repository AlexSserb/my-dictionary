export default function randomInteger(min: number, max: number): number {
    return min + Math.floor((max - min + 1) * Math.random());
};
