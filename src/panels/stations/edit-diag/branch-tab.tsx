import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { List, ListItem, ListItemText, Divider, Icon, TextField, MenuItem, ListItemIcon } from '@material-ui/core';
import { formatStnName } from '../../../utils';
import { ParamContext, CanvasContext } from '../../../context';

function StationEditBranchTab(props: { stnId: string }) {
    const { t } = useTranslation();

    return (
        <List>
            <ListItem>
                <ListItemText>
                    <h3 style={{ margin: 0 }}>{t('stations.edit.branch.left')}</h3>
                </ListItemText>
            </ListItem>
            <BranchSelectSet stnId={props.stnId} direction="left" />
            <Divider />
            <ListItem>
                <ListItemText>
                    <h3 style={{ margin: 0 }}>{t('stations.edit.branch.right')}</h3>
                </ListItemText>
            </ListItem>
            <BranchSelectSet stnId={props.stnId} direction="right" />
        </List>
    );
}

export default StationEditBranchTab;

interface BranchSelectSetProps {
    stnId: string;
    direction: 'left' | 'right';
}

const BranchSelectSet = (props: BranchSelectSetProps) => {
    const { rmgStyle } = useContext(CanvasContext);
    const { param } = useContext(ParamContext);
    const stnInfo = param.stn_list[props.stnId];
    const branchEntry = stnInfo.branch[props.direction];

    return React.useMemo(
        () => (
            <>
                <BranchTypeItem {...props} />
                {branchEntry[0] && (
                    <>
                        <BranchFirstItem {...props} />
                        {rmgStyle !== 'shmetro' && <BranchPosItem {...props} />}
                    </>
                )}
            </>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.stnId, props.direction, branchEntry[0]]
    );
};

interface ItemProps {
    stnId: string;
    direction: 'left' | 'right';
}

const BranchTypeItem = (props: ItemProps) => {
    const { t } = useTranslation();

    const { param, dispatch } = React.useContext(ParamContext);
    const stnInfo = param.stn_list[props.stnId];
    const branchEntry = stnInfo.branch[props.direction];

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let branchType = event.target.value as 'na' | 'through' | 'nonthrough';
        if (branchType === 'na') {
            // no changes
            return;
        } else if (branchType === branchEntry[0]) {
            // no changes
            return;
        } else {
            dispatch({
                type: 'UPDATE_STATION_BRANCH_TYPE',
                stnId: props.stnId,
                direction: props.direction,
                branchType,
            });
        }
    };

    return React.useMemo(
        () => (
            <ListItem>
                <ListItemIcon>
                    <Icon>merge_type</Icon>
                </ListItemIcon>
                <TextField
                    select
                    style={{ width: '100%' }}
                    variant="outlined"
                    label={t('stations.edit.branch.type.title')}
                    onChange={handleChange}
                    value={branchEntry[0] || 'na'}
                >
                    <MenuItem key="na" value="na" disabled={branchEntry.length !== 0}>
                        {t('stations.edit.branch.type.na')}
                    </MenuItem>
                    <MenuItem key="through" value="through" disabled={branchEntry.length === 0}>
                        {t('stations.edit.branch.type.through')}
                    </MenuItem>
                    <MenuItem key="nonthrough" value="nonthrough" disabled={branchEntry.length === 0}>
                        {t('stations.edit.branch.type.nonThrough')}
                    </MenuItem>
                </TextField>
            </ListItem>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.stnId, branchEntry[0]]
    );
};

const BranchFirstItem = (props: ItemProps) => {
    const { t } = useTranslation();

    const { rmgStyle } = useContext(CanvasContext);
    const { param, dispatch } = useContext(ParamContext);
    const stnInfo = param.stn_list[props.stnId];
    const branchEntry = stnInfo.branch[props.direction];
    const neighbours = props.direction === 'left' ? stnInfo.parents : stnInfo.children;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let branchFirst = event.target.value;
        if (branchEntry[1] === branchFirst) {
            // no changes
            return;
        } else {
            let branchEndId = branchFirst;
            let branchEndFirst: string;
            let stnList = param.stn_list;
            if (props.direction === 'right') {
                while (stnList[branchEndId].parents.length === 1) {
                    branchEndId = stnList[branchEndId].children[0];
                }
                branchEndFirst = stnList[branchEndId].parents[neighbours.indexOf(branchFirst)];
            } else {
                while (stnList[branchEndId].children.length === 1) {
                    branchEndId = stnList[branchEndId].parents[0];
                }
                branchEndFirst = stnList[branchEndId].children[neighbours.indexOf(branchFirst)];
            }
            dispatch({
                type: 'UPDATE_STATION_BRANCH_FIRST',
                branches: [
                    {
                        stnId: props.stnId,
                        direction: props.direction,
                        first: branchFirst,
                    },
                    {
                        stnId: branchEndId,
                        direction: props.direction === 'left' ? 'right' : 'left',
                        first: branchEndFirst,
                    },
                ],
            });
        }
    };

    return React.useMemo(
        () => (
            <ListItem>
                <ListItemIcon>
                    <Icon style={{ transform: props.direction === 'left' ? 'scale(-1)' : 'scale(1)' }}>share</Icon>
                </ListItemIcon>
                <TextField
                    select
                    style={{ width: '100%' }}
                    variant="outlined"
                    label={t('stations.edit.branch.first')}
                    onChange={handleChange}
                    value={branchEntry[1] || neighbours[0]}
                >
                    {neighbours.map(stnId => (
                        <MenuItem key={stnId} value={stnId}>
                            {formatStnName(param.stn_list[stnId], rmgStyle)}
                        </MenuItem>
                    ))}
                </TextField>
            </ListItem>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.stnId, branchEntry[1], neighbours.toString()]
    );
};

const BranchPosItem = (props: ItemProps) => {
    // mount only if branchEntry[0] is not undefined

    const { t } = useTranslation();

    const { param, dispatch } = React.useContext(ParamContext);
    const stnInfo = param.stn_list[props.stnId];
    const branchEntry = stnInfo.branch[props.direction] as ['through' | 'nonthrough', string];
    const neighbours = props.direction === 'left' ? stnInfo.parents : stnInfo.children;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let branchPos: 0 | 1 = event.target.value === 'lower' ? 1 : 0;
        if (neighbours.indexOf(branchEntry[1]) === branchPos) {
            // no changes
            return;
        } else {
            let branchEndId = branchEntry[1];
            let stnList = param.stn_list;
            if (props.direction === 'right') {
                while (stnList[branchEndId].parents.length === 1) {
                    branchEndId = stnList[branchEndId].children[0];
                }
                dispatch({
                    type: 'UPDATE_STATION_BRANCH_POS',
                    right: props.stnId,
                    left: branchEndId,
                });
            } else {
                while (stnList[branchEndId].children.length === 1) {
                    branchEndId = stnList[branchEndId].parents[0];
                }
                dispatch({
                    type: 'UPDATE_STATION_BRANCH_POS',
                    left: props.stnId,
                    right: branchEndId,
                });
            }
        }
    };

    return React.useMemo(
        () => (
            <ListItem>
                <ListItemIcon>
                    <Icon>swap_vert</Icon>
                </ListItemIcon>
                <TextField
                    select
                    style={{ width: '100%' }}
                    variant="outlined"
                    label={t('stations.edit.branch.pos.title')}
                    onChange={handleChange}
                    value={neighbours.indexOf(branchEntry[1]) === 1 ? 'lower' : 'upper'}
                >
                    <MenuItem key="upper" value="upper">
                        {t('stations.edit.branch.pos.upper')}
                    </MenuItem>
                    <MenuItem key="lower" value="lower">
                        {t('stations.edit.branch.pos.lower')}
                    </MenuItem>
                </TextField>
            </ListItem>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.stnId, branchEntry[1], neighbours.toString()]
    );
};
