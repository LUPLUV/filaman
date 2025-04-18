import {setRestFilament} from "@/actions/filaments";
import {NextRequest} from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    const uid = searchParams.get('uid');
    const weight = searchParams.get('weight');

    if (!uid) {
        return Response.json({error: 'Missing uid parameter'}, {status: 400});
    }

    if (uid === "00000000000000") {
        return Response.json({error: 'Invalid uid parameter'}, {status: 400});
    }

    if (!weight || isNaN(parseFloat(weight))) {
        return Response.json({error: 'Weight must be a valid number'}, {status: 400});
    }

    try {
        await setRestFilament(uid, parseFloat(weight));
        return Response.json({
            message: 'Filament weight updated successfully'
        }, {status: 200});
    } catch (error) {
        return Response.json({
            error: 'Failed to update filament weight',
            details: error
        }, {status: 500});
    }
}