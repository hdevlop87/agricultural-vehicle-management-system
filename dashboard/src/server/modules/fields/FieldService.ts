import { Injectable } from 'najm-api';
import { FieldRepository } from './FieldRepository';
import { FieldValidator } from './FieldValidator';

@Injectable()
export class FieldService {
  constructor(
    private fieldRepository: FieldRepository,
    private fieldValidator: FieldValidator,
  ) { }

  async getAll() {
    return await this.fieldRepository.getAll();
  }

  async getById(id) {
    await this.fieldValidator.checkFieldExists(id);
    return await this.fieldRepository.getById(id);
  }

  async getByName(name) {
    await this.fieldValidator.checkFieldNameExists(name);
    return await this.fieldRepository.getByName(name);
  }

  async getFieldsBySize() {
    return await this.fieldRepository.getFieldsBySize();
  }

  async getLargeFields(minArea = 10) {
    return await this.fieldRepository.getFieldsByMinArea(minArea);
  }

  async getSmallFields(maxArea = 5) {
    return await this.fieldRepository.getFieldsByMaxArea(maxArea);
  }

  async getFieldsWithActiveOperations() {
    return await this.fieldRepository.getFieldsWithActiveOperations();
  }

  async getTotalArea() {
    return await this.fieldRepository.getTotalArea();
  }

  async getCount() {
    return await this.fieldRepository.getCount();
  }

  async create(data) {
    const {
      id,
      name,
      area,
      description,
      location
    } = data;

    await this.fieldValidator.checkFieldNameIsUnique(name);

    if (id) {
      await this.fieldValidator.checkFieldIdIsUnique(id);
    }

    if (area) {
      await this.fieldValidator.validateAreaHectares(area);
    }

    const fieldDetails = {
      ...(id && { id }),
      name,
      area,
      description,
      location
    }

    await this.fieldValidator.validateCreateField(fieldDetails);
    return await this.fieldRepository.create(fieldDetails);

  }

  async update(id, data) {
    await this.fieldValidator.checkFieldExists(id);

    if (data.name) {
      await this.fieldValidator.checkFieldNameIsUnique(data.name, id);
    }

    if (data.area) {
      await this.fieldValidator.validateAreaHectares(data.area);
    }

    return await this.fieldRepository.update(id, data);
  }

  async delete(id) {
    await this.fieldValidator.checkFieldExists(id);
    await this.fieldValidator.checkFieldNotInUse(id);

    const field = await this.fieldRepository.delete(id);
    return field;
  }

  async deleteAll() {
    return await this.fieldRepository.deleteAll();
  }

  async getFieldOperations(id) {
    await this.fieldValidator.checkFieldExists(id);
    return await this.fieldRepository.getFieldOperations(id);
  }

  async getFieldStatistics(id) {
    await this.fieldValidator.checkFieldExists(id);
    return await this.fieldRepository.getFieldStatistics(id);
  }

  async getFieldUtilization(id) {
    await this.fieldValidator.checkFieldExists(id);
    return await this.fieldRepository.getFieldUtilization(id);
  }

  async getAvailableFields(date, operationTypeId) {
    await this.fieldValidator.validateDate(date);
    return await this.fieldRepository.getAvailableFields(date, operationTypeId);
  }

  async getFieldProductivity(id, startDate, endDate) {
    await this.fieldValidator.checkFieldExists(id);
    await this.fieldValidator.validateDateRange(startDate, endDate);
    return await this.fieldRepository.getFieldProductivity(id, startDate, endDate);
  }

  async seedDemoFields(fieldsData) {
    const createdFields = [];
    for (const field of fieldsData) {
      try {
        const existing = await this.fieldRepository.getByName(field.name);
        if (!existing) {
          const created = await this.create(field);
          createdFields.push(created);
        }
      } catch (error) {
        continue;
      }
    }

    return createdFields;
  }

  async getFieldsRequiringMaintenance() {
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    return await this.fieldRepository.getFieldsWithoutRecentOperations(sixtyDaysAgo.toISOString().split('T')[0]);
  }

  async getOptimalFieldRotation() {
    return await this.fieldRepository.getFieldRotationRecommendations();
  }

}