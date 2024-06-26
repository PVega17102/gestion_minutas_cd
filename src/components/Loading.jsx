
const Loading = () => {

    return (
        <section className='absolute w-[-webkit-fill-available] h-[-webkit-fill-available] flex justify-center items-center'>

            <div
                className=' h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent align-[-0.125em] text-black motion-reduce:animate-[spin_1.5s_linear_infinite]'
                role='status'
            >
                <span
                    className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >
                    Loading...
                </span>
            </div>

        </section>
    )

}

export default Loading;