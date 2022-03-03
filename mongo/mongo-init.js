const dbsToCreate = ['recipeCentral'];

db.createUser(
  {
    user: 'recipe',
    pwd: 'recipe',
    roles: dbsToCreate.map(dbName => {
      return {
        role: 'readWrite',
        db: dbName
      }
    })
  }
);
