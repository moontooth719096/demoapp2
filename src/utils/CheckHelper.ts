//判斷是否有空白
export function isWhiteSpace(text:string):boolean {
    const regex = /^\s*$/;
    return regex.test(text);
}

export default { isWhiteSpace};