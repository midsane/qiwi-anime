export function AnimeLogo({size="small"}) {
    return (
        <div className={`anime-logo ${size === "small"? "w-10 h-10": "w-28 h-28"}`}>
            <img src="/favicon.png" />
        </div>
    );
}

