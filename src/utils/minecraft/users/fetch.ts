interface MinecraftBasicProfile {
    name?: string,
    id?: string,
    errorMessage?: string
}

interface MinecraftFullProfile {
    id?: string,
    name?: string,
    properties?: string[],
    errorMessage?: string
}

export async function basicProfile(nick: string) {
    const response: MinecraftBasicProfile = await (await fetch(`https://api.mojang.com/users/profiles/minecraft/${nick}`)).json();
    if (response.errorMessage) throw new Error(`Minecraft basic profile API: ${response.errorMessage}`);
    return response;
}

export async function fullProfile(uuid: string): Promise<MinecraftFullProfile> {
    const response: MinecraftFullProfile = await (await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`)).json();
    if (response.errorMessage) throw new Error(`Minecraft full profile API: ${response.errorMessage}`);
    return response;
}