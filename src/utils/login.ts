import { FileSystem } from '../services/file';
import { PrimarySchema, SchemaType } from 'src/services/schema';

export namespace Login {
  interface LoginFileSchema extends PrimarySchema {
    username: SchemaType.String;
    password: SchemaType.String;
  }

  const credentialFilePath = 'src/assets/files/credential.enc';
  const fileStream = new FileSystem<LoginFileSchema>(credentialFilePath);

  export function signIn(username: string, password: string) {
    const user = fileStream.Schema.find({ username, password });
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  export function signUp(username: string, password: string) {
    fileStream.Schema.add({
      username,
      password,
    });
    fileStream.save();
  }

  export function updatePassword(
    username: string,
    password: string,
    newPassword: string,
  ) {
    const canSignIn = signIn(username, password);
    if (!canSignIn) {
      return;
    }

    fileStream.Schema.update({ username }, { password: newPassword });
    fileStream.save();
  }
}
