import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Projects extends BaseSchema {
  protected tableName = 'projects'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.string('skill_ids').after('project_id')
      table.string('service_id').after('project_id')
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('skill_ids')
      table.dropColumn('service_id')
    })
  }
}
