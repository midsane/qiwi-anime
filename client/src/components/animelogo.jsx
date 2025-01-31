export function AnimeLogo({size="small"}) {
    return (
        <div className={`anime-logo ${size === "small"? "w-10 h-10": "w-40 h-40"}`}>
            <img src="/favicon.png" />
        </div>
    );
}

