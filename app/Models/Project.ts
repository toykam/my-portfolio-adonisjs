import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({columnName: 'project_name'})
  public projectName: string

  @column({columnName: 'project_id'})
  public projectId: string

  @column({columnName: 'project_description'})
  public projectDescription: string

  @column({columnName: 'project_image'})
  public projectImage: string

  @column({columnName: 'project_url'})
  public projectUrl: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
