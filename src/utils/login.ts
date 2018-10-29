import { FileSystem } from '../services/file';

export namespace Login {
    interface LoginFile {
        username: string;
        password: string;
    }

    const credentialFilePath = 'src/assets/files/credential.enc';
    const fileStream = new FileSystem<LoginFile>(credentialFilePath);

    export function signIn(username: string, password: string) {
        const user = fileStream.Data.find({ username, password });
        if (user) {
            return true;
        } else {
            return false;
        }
    }

    export function signUp(username: string, password: string) {
        fileStream.Data.add({
            username,
            password,
        });
        fileStream.save();
    }

    export function updatePassword(username: string, password: string, newPassword: string) {
        const canSignIn = signIn(username, password);
        if (!canSignIn) {
            return;
        }

        fileStream.Data.update({ username }, { password: newPassword });
        fileStream.save();
    }
}
