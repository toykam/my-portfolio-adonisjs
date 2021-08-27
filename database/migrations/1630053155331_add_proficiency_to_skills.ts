import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Skills extends BaseSchema {
  protected tableName = 'skills'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.integer('proficiency').defaultTo(50)
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('proficiency')
    })
  }
}
