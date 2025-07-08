export class ApiClient {

    async get
    (
        url: string,
        header: {},
    )
    {
        const response = await fetch(
            url,
            {
                headers: header,
                method: "GET"
            },
        )
        return response
    }


    async post
    (
        url: string,
        header: {},
        body: {}
    )
    {
        return await fetch(
            url,
            {
                headers: header,
                body: JSON.stringify(body),
                method: "POST"
            },
        )
    }

    async put
    (
        url: string,
        header: {},
        body: {}
    )
    {
        return await fetch(
            url,
            {
                headers: header,
                body: JSON.stringify(body),
                method: "PUT"
            },
        )
    }

}