import Knex from 'knex';

const Database = Knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
});

export const Init = async () => {
  await Database.schema.hasTable('comments').then((has) => {
    if (!has) {
      return Database.schema.createTableIfNotExists('comments', (builder) => {
        builder.uuid('id').unique().primary();
        builder.uuid('parent_comment_id');
        builder.string('user_avatar'); // user fields would be in a user table if one existed
        builder.string('user_name');
        builder.dateTime('created_at');
        builder.string('body', 4095);
      });
    }
  });

  await Database.schema.hasTable('upvotes').then((has) => {
    if (!has) {
      return Database.schema.createTableIfNotExists('upvotes', (builder) => {
        builder.uuid('id').unique().primary();
        builder.uuid('comment_id').references('comments.id').withKeyName('fk_upvote_user_id');
      });
    }
  });
};

export default Database;
