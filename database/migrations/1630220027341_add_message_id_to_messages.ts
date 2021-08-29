import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { v4 } from 'uuid'

export default class Messages extends BaseSchema {
  protected tableName = 'messages'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.uuid('message_id').defaultTo(v4())
      table.boolean('seen').defaultTo(false)
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('message_id')
      table.dropColumn('seen')
    })
  }
}
