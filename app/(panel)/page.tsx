import {FilamentOverview} from "@/app/(panel)/_components/filament-overview";
import {getLogtoContext, signIn} from '@logto/next/server-actions';
import {logtoConfig} from "@/lib/logto";
import SignIn from "@/app/auth/login-form";

export default async function Panel() {
    const {isAuthenticated, claims} = await getLogtoContext(logtoConfig);

    if (!isAuthenticated) {
        return (
            <div>
                Not authenticated
                <SignIn
                    onSignIn={async () => {
                        'use server';

                        await signIn(logtoConfig);
                    }}
                />
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen">
            Hello, {claims?.sub}
            <FilamentOverview/>
        </div>
    );
}