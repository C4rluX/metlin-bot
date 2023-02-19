export function hasRoleHereOrEveryoneMention(text: string) {
    return /<@&\d+>|@everyone|@here/g.test(text);
}