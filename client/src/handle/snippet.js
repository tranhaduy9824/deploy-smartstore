function snippet(string, count, returnString = string ) {
    if (string?.length > count) {
        return string.substring(0, count) + '...';
    } else {
        return returnString;
    }
}

export default snippet;