import { Injectable, t } from 'najm-api';
import { FieldRepository } from './FieldRepository';

import { createFieldSchema } from '@/server/database/schema';
import { parseSchema } from '@/server/shared/utils';

@Injectable()
export class FieldValidator {
  constructor(
    private fieldRepository: FieldRepository,
  ) { }

  async validateCreateField(data) {
    return parseSchema(createFieldSchema, data);
  }

  async checkFieldIdIsUnique(id) {
    const existingField = await this.fieldRepository.getById(id);
    if (existingField) {
      throw new Error(t('fields.errors.idExists'));
    }
  }

  async isFieldExists(id) {
    const existingField = await this.fieldRepository.getById(id);
    return !!existingField;
  }

  async isFieldNameExists(name) {
    const existingField = await this.fieldRepository.getByName(name);
    return !!existingField;
  }

  async isFieldInUse(fieldId) {
    return await this.fieldRepository.checkFieldInUse(fieldId);
  }

  validateAreaHectares(area) {
    if (!area) return true;

    const numericArea = parseFloat(area);
    if (isNaN(numericArea) || numericArea <= 0) {
      throw new Error(t('fields.errors.invalidArea'));
    }

    // Reasonable upper limit for field area (1000 hectares)
    if (numericArea > 1000) {
      throw new Error(t('fields.errors.areaTooLarge'));
    }

    // Minimum practical field size (0.1 hectares = 1000 sq meters)
    if (numericArea < 0.1) {
      throw new Error(t('fields.errors.areaTooSmall'));
    }

    return true;
  }

  validateFieldName(name) {
    if (!name || name.trim().length < 2) {
      throw new Error(t('fields.errors.nameMinLength'));
    }

    if (name.length > 100) {
      throw new Error(t('fields.errors.nameMaxLength'));
    }

    // Check for valid characters (letters, numbers, spaces, hyphens, underscores)
    const nameRegex = /^[a-zA-Z0-9\s\-_\.]+$/;
    if (!nameRegex.test(name)) {
      throw new Error(t('fields.errors.invalidName'));
    }

    return true;
  }

  validateDescription(description) {
    if (!description) return true;

    if (description.length > 500) {
      throw new Error(t('fields.errors.descriptionTooLong'));
    }

    return true;
  }

  validateDate(date) {
    if (!date) {
      throw new Error(t('validation.general.requiredFieldMissing'));
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error(t('validation.general.invalidDateFormat'));
    }

    return true;
  }

  validateDateRange(startDate, endDate) {
    this.validateDate(startDate);
    this.validateDate(endDate);

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      throw new Error(t('fields.errors.invalidDateRange'));
    }

    // Check if date range is not too far in the future
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    if (start > oneYearFromNow) {
      throw new Error(t('fields.errors.dateRangeTooFuture'));
    }

    return true;
  }

  //======================= Existence Checks (throw errors)

  async checkFieldExists(id) {
    const fieldExists = await this.isFieldExists(id);
    if (!fieldExists) {
      throw new Error(t('fields.errors.notFound'));
    }
    return true;
  }

  async checkFieldNameExists(name) {
    const field = await this.fieldRepository.getByName(name);
    if (!field) {
      throw new Error(t('fields.errors.notFound'));
    }
    return field;
  }

  //======================= Uniqueness Checks (throw errors)

  async checkFieldNameIsUnique(name, excludeId = null) {
    this.validateFieldName(name);
    const existingField = await this.fieldRepository.getByName(name);
    if (existingField && existingField.id !== excludeId) {
      throw new Error(t('fields.errors.nameExists'));
    }
  }

  //======================= Business Rules Checks

  async checkFieldNotInUse(fieldId) {
    const inUse = await this.isFieldInUse(fieldId);
    if (inUse) {
      throw new Error(t('fields.errors.inUse'));
    }
    return true;
  }

  async checkFieldCanBeDeleted(fieldId) {
    // Check if field has any operations
    await this.checkFieldNotInUse(fieldId);

    // Additional business rules can be added here
    // For example, check if it's a critical field or has historical data
    const field = await this.fieldRepository.getById(fieldId);
    const operations = await this.fieldRepository.getFieldOperations(fieldId);

    if (operations.length > 0) {
      throw new Error(t('fields.errors.cannotDeleteWithHistory'));
    }

    return true;
  }

  //======================= Input Validation Helpers

  validateFieldData(data) {
    const { name, area, description } = data;

    if (name) {
      this.validateFieldName(name);
    }

    if (area) {
      this.validateAreaHectares(area);
    }

    if (description) {
      this.validateDescription(description);
    }

    return true;
  }

  validateFieldUpdate(id, data) {
    // Validate that at least one field is being updated
    const updateFields = ['name', 'area', 'description'];
    const hasValidUpdate = updateFields.some(field => data[field] !== undefined);

    if (!hasValidUpdate) {
      throw new Error(t('fields.errors.noFieldsToUpdate'));
    }

    return this.validateFieldData(data);
  }

  //======================= Agricultural Field Specific Validations

  validateFieldSizeCategories() {
    // Define field size categories for agricultural purposes
    return {
      'Very Small': { min: 0.1, max: 2 },      // 0.1-2 hectares
      'Small': { min: 2, max: 10 },            // 2-10 hectares  
      'Medium': { min: 10, max: 50 },          // 10-50 hectares
      'Large': { min: 50, max: 200 },          // 50-200 hectares
      'Very Large': { min: 200, max: 1000 }    // 200-1000 hectares
    };
  }

  getFieldSizeCategory(ar) {
    const categories = this.validateFieldSizeCategories();
    const area = parseFloat(ar);

    for (const [category, range] of Object.entries(categories)) {
      if (area >= range.min && area < range.max) {
        return category;
      }
    }

    return area >= 1000 ? 'Extremely Large' : 'Unknown';
  }

  //======================= Delete All Validation

  async checkNoFieldsInUse() {
    const fieldsInUse = await this.fieldRepository.getFieldsInUse();
    if (fieldsInUse.length > 0) {
      const fieldNames = fieldsInUse.map(f => f.fieldName).join(', ');
      throw new Error(t('fields.errors.fieldsInUseCannotDelete', { fieldNames }));
    }
    return true;
  }

  async validateDeleteAllOperation() {
    // Check if any fields are currently in use
    await this.checkNoFieldsInUse();

    // Get field count for confirmation
    const count = await this.fieldRepository.getCount();
    if (count.count === 0) {
      throw new Error(t('fields.errors.noFieldsToDelete'));
    }

    return {
      fieldCount: count.count,
      canDelete: true
    };
  }

}