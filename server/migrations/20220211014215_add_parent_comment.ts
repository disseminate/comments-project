import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('comments', (table) => {
    table.uuid('parent_comment_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('comments', (table) => {
    table.dropColumn('parent_comment_id');
  });
}
