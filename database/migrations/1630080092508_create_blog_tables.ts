import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreateBlogTables extends BaseSchema {
  protected tableName = 'blogs'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title', 225).unique()
      table.string('slug', 225).unique()
      table.string('blog_image')
      table.string('blog_id')
      table.text('content')
      table.integer('views').defaultTo(0)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.dateTime('created_at', { useTz: true })
      table.dateTime('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
