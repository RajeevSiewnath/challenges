import React, {useCallback, useEffect, useState} from "react";
import {Consent, CONSENT_TYPE_LABEL} from "./types";
import {getConsents} from "./api";

export default function Consents() {
    const [consents, setConsents] = useState<null | Array<Consent>>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pages, setPages] = useState<number>(0);

    useEffect(() => {
        (async () => {
            const data = await getConsents();
            setConsents(data);
            setPages(Math.ceil(data.length / 2));
        })();
    }, []);

    const renderPages = useCallback(() => {
        const p = [];
        for (let i = 0; i < pages; i++) {
            p.push(<div key={i} className={currentPage === i ? "current page" : "page"}
                        onClick={() => setCurrentPage(i)}><a href='#'>{i + 1}</a></div>);
        }
        return p;
    }, [currentPage, pages]);

    return <div id="consents">
        {consents === null ? "Loading" : <>
            <div className="consent">
                <div className="name">Name</div>
                <div className="email">Email</div>
                <div className="consents-types">Consents given for</div>
            </div>
            {consents.filter((c, i) => Math.ceil((i + 1) / 2) === currentPage + 1)
                .map((consent, index) => <div key={index} className="consent">
                        <div className="name">{consent.name}</div>
                        <div className="email">{consent.email}</div>
                        <div
                            className="consents-types">{consent.consents.map(c => CONSENT_TYPE_LABEL[c]).join(', ')}&nbsp;</div>
                    </div>
                )}
            <div className="consent pager">
                <div className="prev" onClick={() => setCurrentPage(currentPage - 1)}>{currentPage > 0 ?
                    <a href='#'>{'<<< Previous Page'}</a> : <>&nbsp;</>}</div>
                <div className="pages">
                    {renderPages()}
                </div>
                <div className="next" onClick={() => setCurrentPage(currentPage + 1)}>{currentPage < (pages - 1) ?
                    <a href='#'>{'Next Page >>>'}</a> : <>&nbsp;</>}</div>
            </div>
        </>}
    </div>;
}