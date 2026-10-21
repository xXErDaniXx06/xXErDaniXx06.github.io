import { describe, expect, it } from 'vitest';
import { MESSAGE_LIMITS, normalizeMessage, validateMessage } from '../src/lib/contact';

const valid = { name: 'Ana', email: 'ana@example.com', subject: 'Hola', message: 'Un mensaje' };

describe('validación de mensajes', () => {
  it('acepta un mensaje completo', () => {
    expect(validateMessage(valid)).toBeNull();
  });

  it('exige todos los campos', () => {
    expect(validateMessage({ ...valid, subject: '   ' })).toEqual({ error: 'required', field: 'subject' });
    expect(validateMessage({ ...valid, name: undefined })).toEqual({ error: 'required', field: 'name' });
  });

  it('limita la longitud de cada campo', () => {
    expect(validateMessage({ ...valid, message: 'x'.repeat(MESSAGE_LIMITS.message + 1) })).toEqual({
      error: 'too_long',
      field: 'message',
    });
  });

  it('comprueba el formato del email', () => {
    expect(validateMessage({ ...valid, email: 'ana@' })).toEqual({ error: 'invalid_email', field: 'email' });
  });

  it('recorta los espacios', () => {
    expect(normalizeMessage({ name: ' Ana ', email: ' a@b.c ', subject: ' S ', message: ' M ' })).toEqual({
      name: 'Ana',
      email: 'a@b.c',
      subject: 'S',
      message: 'M',
    });
  });
});
