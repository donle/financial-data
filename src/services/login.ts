import { LoginDataStore } from '@/utils/datastore';

export namespace Login {

  export async function signIn(username: string, password: string) {
    return LoginDataStore.findOneAsync({ username, password });
  }

  export function signUp(username: string, password: string) {
    return LoginDataStore.insertAsync({
      username,
      password,
    });
  }

  export async function updatePassword(
    username: string,
    password: string,
    newPassword: string,
  ) {
    const canSignIn = await signIn(username, password);
    if (!canSignIn) {
      return;
    }

    return LoginDataStore.updateAsync({ username }, { password: newPassword });
  }
}
