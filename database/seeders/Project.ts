import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Project from 'App/Models/Project'

export default class ProjectSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    Project.createMany([
      {
        projectName: "Paysmosmo"
      }
    ]);
  }
}
