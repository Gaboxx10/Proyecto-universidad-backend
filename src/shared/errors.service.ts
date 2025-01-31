import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ValidationError } from 'class-validator';
import { HttpException, NotFoundException } from '@nestjs/common';  // Importación de excepciones

@Injectable()
export class Errors {
  handleError(error: any, entity: string) {
    // Verificar si el error es una HttpException o NotFoundException
    if (error instanceof HttpException || error instanceof NotFoundException) {
      return error.getResponse(); // Retorna directamente la respuesta de la excepción
    }

    if (error instanceof PrismaClientKnownRequestError) {
      return this.handlePrismaError(error, entity);
    }

    if (Array.isArray(error) && error[0] instanceof ValidationError) {
      return this.handleValidationErrors(error);
    }

    return this.formatErrorResponse('No se pudo procesar la solicitud', 500, 'UNKNOWN_ERROR');
  }

  private handlePrismaError(error: PrismaClientKnownRequestError, entity: string) {
    console.log(error);

    const { code, meta, message } = error;
    const field = meta?.target?.[0];

    const errorMap = {
      'P2002': this.handleP2002Error,
      'P2003': this.handleP2003Error,
      'P2005': this.handleP2005Error,
      'P2025': this.handleP2025Error,
    };

    const handler = errorMap[code] || this.handleUnknownPrismaError;

    return handler.call(this, field, entity, message, code, error);
  }

  private handleP2002Error(field: string, entity: string, _message: string, code: string, error: any) {
    const errorMessage = this.customizeFieldError(field, entity);
    return this.formatErrorResponse(errorMessage, 409, code, field, error);
  }

  private handleP2003Error(field: string, _entity: string, _message: string, code: string, error: any) {
    const errorMessage = `No se puede eliminar el registro porque está asociado a otro recurso: ${field}`;
    return this.formatErrorResponse(errorMessage, 400, code, field, error);
  }

  private handleP2005Error(_field: string, _entity: string, message: string, code: string, error: any) {
    const errorMessage = message || 'Un campo requerido está vacío o es nulo';
    return this.formatErrorResponse(errorMessage, 400, code, null, error);
  }

  private handleP2025Error(_field: string, _entity: string, message: string, code: string, error: any) {
    const errorMessage = message || 'No se encontró el registro solicitado';
    return this.formatErrorResponse(errorMessage, 404, code, null, error);
  }

  private handleUnknownPrismaError(_field: string, _entity: string, message: string, code: string, error: any) {
    const errorMessage = message || 'Ocurrió un error desconocido';
    return this.formatErrorResponse(errorMessage, 500, code, null, error);
  }

  private handleValidationErrors(errors: ValidationError[]) {
    const validationErrors = errors.map(err => `${err.property}: ${Object.values(err.constraints).join(', ')}`);
    return this.formatErrorResponse(validationErrors.join('; '), 400, 'VALIDATION_ERROR');
  }

  private customizeFieldError(field: string, entity: string): string {
    const entityMessages = {
      'cliente': this.customizeClientFieldError(field),
      'vehiculo': this.customizeVehicleFieldError(field),
      'diagnostico': `El diagnóstico con el campo '${field}' tiene un valor duplicado o conflictivo.`,
      'presupuesto': `El presupuesto con el campo '${field}' tiene un valor duplicado o conflictivo.`,
      'usuario': `El usuario con el campo '${field}' tiene un valor duplicado o conflictivo.`,
      'orden-trabajo': `La orden de trabajo con el campo '${field}' tiene un valor duplicado o conflictivo.`,
    };

    return entityMessages[entity] || `El campo '${field}' tiene un valor duplicado o conflictivo.`;
  }

  private customizeClientFieldError(field: string): string {
    const clientMessages = {
      'email': 'El correo electrónico proporcionado ya está registrado. Por favor, utiliza otro.',
      'cedula_identidad': 'La cédula de identidad ya está registrada. Por favor, revisa y prueba con otra.',
      'telefono': 'El número de teléfono ya está en uso. Intenta con otro.',
      'user_name': 'El nombre de usuario ya está en uso. Elige otro nombre.',
    };

    return clientMessages[field] || `El campo '${field}' tiene un valor duplicado o conflictivo.`;
  }

  private customizeVehicleFieldError(field: string): string {
    const vehicleMessages = {
      'placa': 'La placa del vehículo ya está registrada. Por favor, ingresa una placa diferente.',
    };

    return vehicleMessages[field] || `El campo '${field}' tiene un valor duplicado o conflictivo.`;
  }

  private formatErrorResponse(
    message: string,
    statusCode: number,
    code: string,
    field?: string,
    error?: any,
) {
    const errorResponse: any = {
        message: message,
        status: statusCode,
        code: code,
        field: field,
    };

    // Solo incluir detalles si hay información adicional en el error
    if (error) {
        errorResponse.details = {
            model: error.meta?.modelName,
            target: error.meta?.target,
            description: error.message,
            clientVersion: error.clientVersion,
        };
    }

    // Añadir `cause` solo si es un error relacionado con una causa específica (p. ej., un error 404)
    if (statusCode === 404 && error?.message === 'Vehiculo no encontrado') {
        errorResponse.cause = {
            message: error.message,
            status: 404,
            code: 'NOT_FOUND',
        };
    }

    return errorResponse;
}
}
