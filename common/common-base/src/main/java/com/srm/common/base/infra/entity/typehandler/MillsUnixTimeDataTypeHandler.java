 

package com.srm.common.base.infra.entity.typehandler;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.Objects;

import com.srm.common.util.datetime.DateTimeUtil;


/**
 * Unix 毫秒时间戳的处理器
 *
 * @author fitz.yang
 * @version 2020.12
 * @since triton 2020.12
 */
public class MillsUnixTimeDataTypeHandler extends BaseTypeHandler<LocalDateTime> {
    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, LocalDateTime dateTime, JdbcType jdbcType) throws SQLException {
        long unixMillsTime = 0;
        if (Objects.nonNull(dateTime)) {
            unixMillsTime = DateTimeUtil.timeMills(dateTime);
        }
        ps.setObject(i, unixMillsTime);
    }

    @Override
    public LocalDateTime getNullableResult(ResultSet resultSet, String columnName) throws SQLException {
        long unixTime = resultSet.getLong(columnName);
        return unixMillsTime(unixTime);
    }

    @Override
    public LocalDateTime getNullableResult(ResultSet resultSet, int columnIndex) throws SQLException {
        long unixTime = resultSet.getLong(columnIndex);
        return unixMillsTime(unixTime);
    }

    @Override
    public LocalDateTime getNullableResult(CallableStatement callableStatement, int columnIndex) throws SQLException {
        long unixTime = callableStatement.getLong(columnIndex);
        return unixMillsTime(unixTime);
    }

    private LocalDateTime unixMillsTime(long unixTime) {
        if (unixTime <= 0) {
            return null;
        }
        return DateTimeUtil.localDateTime(unixTime);
    }
}
