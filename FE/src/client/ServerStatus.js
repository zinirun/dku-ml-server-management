import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
} from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import SnackMessage from './components/SnackMessage';
import { useQuery } from 'react-apollo';
import { GET_SERVERS_FROM_CLIENT } from '../queries';

const useStyles = makeStyles((theme) => ({
    tableWrapper: {
        marginTop: theme.spacing(5),
    },
    table: {
        minWidth: 500,
        '& .MuiTableCell-root': {
            padding: 10,
        },
    },
}));

function StatusCircle({ color }) {
    return <FiberManualRecordIcon style={{ color }}>●</FiberManualRecordIcon>;
}

export default function ServerStatus() {
    const classes = useStyles();
    const [servers, setServers] = useState([]);
    const { loading, error, data } = useQuery(GET_SERVERS_FROM_CLIENT);

    useEffect(() => {
        if (data) {
            setServers(
                data.getServersFromClient.map((s) => {
                    return { ...s, ram: `${s.ram}GB`, status: 0 };
                }),
            );
        }
    }, [data, setServers]);

    if (loading) return <CircularProgress />;
    if (error)
        return (
            <SnackMessage message="죄송합니다. 데이터 처리 중 에러가 발생했습니다. 잠시 후에 다시 시도해주세요." />
        );

    return (
        <div>
            <SnackMessage message="단국대학교 서버관리시스템에 접속하신 것을 환영합니다. 사용 목적에 적합한 서버를 확인 후 선택하여 예약하시면 승인을 도와드리겠습니다." />
            <TableContainer className={classes.tableWrapper} component={Paper}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">서버ID</TableCell>
                            <TableCell align="center">서버명</TableCell>
                            <TableCell align="center">OS</TableCell>
                            <TableCell align="center">CPU</TableCell>
                            <TableCell align="center">RAM</TableCell>
                            <TableCell align="center">가동상태</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {servers.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell align="center" component="th" scope="row">
                                    {row.id}
                                </TableCell>
                                <TableCell align="center">{row.name}</TableCell>
                                <TableCell align="center">{row.os}</TableCell>
                                <TableCell align="center">{row.cpu}</TableCell>
                                <TableCell align="center">{row.ram}</TableCell>
                                <TableCell align="center">
                                    {row.status === 0 ? (
                                        <StatusCircle color="green" />
                                    ) : (
                                        <StatusCircle color="crimson" />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
