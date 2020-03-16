import * as React from 'react';
import { ParamContext } from '../../context';
import StationNumberText from '../station-num-gzmtr';

const InfoGZMTR = () => {
    const { param } = React.useContext(ParamContext);
    const curStnInfo = param.stn_list[param.current_stn_idx];

    const curNameEl = React.createRef<SVGGElement>();
    const [nameBBox, setNameBBox] = React.useState({ width: 0 } as DOMRect);
    React.useEffect(() => setNameBBox(curNameEl.current.getBBox()), [curStnInfo.name[0], curStnInfo.name[1]]);

    const nextStnId = curStnInfo[param.direction === 'l' ? 'parents' : 'children'];

    return (
        <g>
            <g
                id="platform"
                style={{
                    ['--translate-x' as any]: `${param.direction === 'l' ? param.svg_dest_width - 100 : 100}px`,
                }}
            >
                <circle cx={0} cy={0} r={30} fill="var(--rmg-theme-colour)" />
                <text className="rmg-name__en" fontSize="38px" dy={-9.5}>
                    {param.platform_num}
                </text>
                <text className="rmg-name__zh" fontSize="13px" dy={10}>
                    站台
                </text>
                <text className="rmg-name__en" fontSize="9px" dy={21}>
                    Platform
                </text>
            </g>
            <g
                id="big_name"
                ref={curNameEl}
                style={{
                    ['--translate-y' as any]: `${0.5 * param.svg_height -
                        50 -
                        (curStnInfo.name[1].split('\\').length - 1) * 18}px`,
                }}
            >
                <text className="rmg-name__zh" fontSize="90px">
                    {curStnInfo.name[0]}
                </text>
                {curStnInfo.name[1].split('\\').map((txt, i) => (
                    <text key={i} className="rmg-name__en" dy={70 + i * 36} fontSize="36px">
                        {txt}
                    </text>
                ))}
            </g>
            <g
                id="big_stn_num"
                style={{
                    ['--translate-x' as any]: `${(param.svg_dest_width + nameBBox.width) / 2 + 55}px`,
                    ['--translate-y' as any]: `${0.5 * param.svg_height -
                        30 -
                        (curStnInfo.name[1].split('\\').length - 1) * 18}px`,
                }}
            >
                <BigStnNum lineNum={param.line_num} stnNum={curStnInfo.num} />
            </g>

            {nextStnId.includes('linestart') || nextStnId.includes('lineend') ? (
                <></>
            ) : nextStnId.length === 1 ? (
                <BigNext nextId={nextStnId[0]} nameBBox={nameBBox} />
            ) : (
                <BigNext2 nextIds={nextStnId} nameBBox={nameBBox} />
            )}
        </g>
    );
};

export default InfoGZMTR;

const BigStnNum = React.memo(
    (props: { lineNum: string; stnNum: string }) => (
        <>
            <path
                className="rmg-stn rmg-stn--future"
                d="M 0,12.95 V -12.95 H -12.95 a 12.95,12.95 0 0,0 0,25.9 h 25.9 a 12.95,12.95 0 0,0 0,-25.9 H 0 "
            />
            <g transform="scale(1.4)">
                <StationNumberText {...props} />
            </g>
        </>
    ),
    (prevProps, nextProps) => prevProps.lineNum === nextProps.lineNum && prevProps.stnNum === nextProps.stnNum
);

const BigNext = (props: { nextId: string; nameBBox: DOMRect }) => {
    const { param } = React.useContext(ParamContext);

    const [nextBBox, setNextBBox] = React.useState({ width: 0 } as DOMRect);
    const nextNameEl = React.createRef<SVGGElement>();
    React.useEffect(() => setNextBBox(nextNameEl.current.getBBox()), []);

    const nextNameZHCount = param.stn_list[props.nextId].name[0].length;
    const nameBcrX = (param.svg_dest_width - props.nameBBox.width) / 2;

    return (
        <>
            <g id="big_next">
                <g
                    textAnchor="middle"
                    style={{
                        ['--translate-x' as any]:
                            param.direction === 'l'
                                ? '80px'
                                : nextNameZHCount <= 2
                                ? `${param.svg_dest_width - 45 - nextBBox.width - 70}px`
                                : `${param.svg_dest_width - 45 - nextBBox.width - 35 * 1.5}px`,
                    }}
                >
                    <text className="rmg-name__zh">下站</text>
                    <text className="rmg-name__en" dy={30}>
                        Next
                    </text>
                </g>
                <g
                    textAnchor="start"
                    ref={nextNameEl}
                    style={{
                        ['--translate-x' as any]:
                            param.direction === 'l'
                                ? nextNameZHCount <= 2
                                    ? `${115 + 35}px`
                                    : `${115 + 35 / 2}px`
                                : `${param.svg_dest_width - 45 - nextBBox.width}px`,
                    }}
                >
                    <text className="rmg-name__zh">{param.stn_list[props.nextId].name[0]}</text>
                    {param.stn_list[props.nextId].name[1].split('\\').map((txt, i) => (
                        <text className="rmg-name__en" dy={30 + i * 17} key={i}>
                            {txt}
                        </text>
                    ))}
                </g>
            </g>
            <path
                id="arrow"
                d="M 60,60 L 0,0 L 60,-60 H 100 L 55,-15 H 160 V 15 H 55 L 100,60z"
                fill="black"
                style={{
                    ['--translate-x' as any]:
                        param.direction === 'l'
                            ? `${(115 + 35 * ((nextNameZHCount <= 2 ? 1 : 0.5) + nextNameZHCount) + nameBcrX) / 2 -
                                  20}px`
                            : `${(param.svg_dest_width -
                                  45 -
                                  nextBBox.width -
                                  (nextNameZHCount <= 2 ? 70 + 35 : 35 * 2.5) +
                                  nameBcrX +
                                  props.nameBBox.width +
                                  55 +
                                  18.5 * 1.4) /
                                  2 +
                                  20}px`,
                    ['--rotate' as any]: param.direction === 'l' ? '0deg' : '180deg',
                }}
            />
        </>
    );
};

const BigNext2 = (props: { nextIds: string[]; nameBBox: DOMRect }) => {
    const { param, routes } = React.useContext(ParamContext);

    const [nextBBox, setNextBBox] = React.useState({ width: 0 } as DOMRect);

    const validRoutes = props.nextIds.map(stnId =>
        routes
            .filter(route => route.indexOf(stnId) !== -1)
            .map(route => route.filter(s => !['linestart', 'lineend'].includes(s)))
    );
    const validEnds = validRoutes.map(routes => {
        if (param.direction === 'l') {
            return Array.from(new Set(routes.map(route => route[0]))).reverse();
        } else {
            return Array.from(new Set(routes.map(route => route.reverse()[0])));
        }
    });

    const nextNameZHCount = Math.max(...props.nextIds.map(id => param.stn_list[id].name[0].length));
    const nameBcrX = (param.svg_dest_width - props.nameBBox.width) / 2;

    return (
        <>
            <g id="big_next_2">
                {props.nextIds.map((stnId, i) => {
                    const nextNameEl = React.createRef<SVGGElement>();
                    React.useEffect(
                        () =>
                            setNextBBox(prevBBox => {
                                let nextBBox = nextNameEl.current.getBBox();
                                return prevBBox.width > nextBBox.width ? prevBBox : nextBBox;
                            }),
                        []
                    );

                    return (
                        <React.Fragment key={i}>
                            <g
                                textAnchor="middle"
                                style={{
                                    ['--translate-x' as any]:
                                        param.direction === 'l'
                                            ? '72px'
                                            : `${param.svg_dest_width - 45 - nextBBox.width - 41}px`,
                                }}
                            >
                                <text className="rmg-name__zh">下站</text>
                                <text className="rmg-name__en" y={22}>
                                    Next
                                </text>
                            </g>
                            <g
                                ref={nextNameEl}
                                textAnchor="start"
                                style={{
                                    ['--translate-x' as any]:
                                        param.direction === 'l'
                                            ? '113px'
                                            : `${param.svg_dest_width - 45 - nextBBox.width}px`,
                                }}
                            >
                                <text className="rmg-name__zh">{param.stn_list[stnId].name[0]}</text>
                                {param.stn_list[stnId].name[1].split('\\').map((txt, j) => (
                                    <text key={j} className="rmg-name__en" y={22 + j * 13}>
                                        {txt}
                                    </text>
                                ))}
                                <text className="rmg-name__zh" y={-35}>
                                    {validEnds[i].map(s => param.stn_list[s].name[0]).join('/') + '方向'}
                                </text>
                                <text className="rmg-name__en rmg-name__gzmtr--next2-dest" y={-20}>
                                    {'Towards ' +
                                        validEnds[i]
                                            .map(s => param.stn_list[s].name[1])
                                            .join('/')
                                            .replace('\\', ' ')}
                                </text>
                            </g>
                        </React.Fragment>
                    );
                })}
            </g>
            <path
                id="arrow"
                d="M 60,60 L 0,0 L 60,-60 H 100 L 55,-15 H 160 V 15 H 55 L 100,60z"
                fill="black"
                style={{
                    ['--translate-x' as any]:
                        param.direction === 'l'
                            ? `${(99 + 27 * (1 + nextNameZHCount) + nameBcrX) / 2 - 20}px`
                            : `${(param.svg_dest_width -
                                  45 -
                                  nextBBox.width -
                                  41 -
                                  27 +
                                  nameBcrX +
                                  props.nameBBox.width +
                                  55 +
                                  18.5 * 1.4) /
                                  2 +
                                  20}px`,
                    ['--rotate' as any]: param.direction === 'l' ? '0deg' : '180deg',
                }}
            />
        </>
    );
};