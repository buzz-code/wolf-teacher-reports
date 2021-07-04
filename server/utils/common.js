export function getListFromTable(table, user_id) {
    return new table().where({ user_id })
        .query({ select: ['id', 'name'] })
        .fetchAll()
        .then(result => result.toJSON());
}
