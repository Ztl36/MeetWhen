import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// 配置 dayjs 插件
dayjs.extend(utc);
dayjs.extend(timezone);

export default function TimeCard({ item, now, onDelete }) {
  // 计算当地时间 - 修复 Android 时区失效问题
  const localTime = dayjs(now).tz(item.timezone);
  const formattedTime = localTime.format('HH:mm');
  
  // 判断昼夜状态（6点到18点为白天）
  const hour = localTime.hour();
  const isDay = hour >= 6 && hour < 18;
  
  // 根据昼夜状态设置样式
  const cardStyle = {
    ...styles.card,
    backgroundColor: isDay ? '#FFFFFF' : '#1C1C1E',
    shadowOpacity: isDay ? 0.05 : 0.2,
  };
  
  const nameStyle = {
    ...styles.name,
    color: isDay ? '#000000' : '#FFFFFF',
  };
  
  const cityStyle = {
    ...styles.city,
    color: isDay ? '#8E8E93' : '#A1A1A6',
  };
  
  const timeStyle = {
    ...styles.time,
    color: isDay ? '#000000' : '#FFFFFF',
  };
  
  const offsetStyle = {
    ...styles.offset,
    color: isDay ? '#8E8E93' : '#A1A1A6',
  };
  
  // 昼夜图标
  const dayNightIcon = isDay ? '☀️' : '🌙';
  
  // 生成头像占位符颜色
  const getAvatarColor = (name) => {
    const colors = ['#4A90E2', '#9013FE', '#50E3C2', '#F5A623', '#D0021B'];
    const index = name.length % colors.length;
    return colors[index];
  };
  
  // 渲染头像
  const renderAvatar = () => {
    if (item.avatarUrl) {
      return (
        <Image 
          source={{ uri: item.avatarUrl }} 
          style={styles.avatar} 
        />
      );
    } else {
      const avatarColor = getAvatarColor(item.name);
      const firstChar = item.name.charAt(0).toUpperCase();
      return (
        <View style={[styles.avatarPlaceholder, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>{firstChar}</Text>
        </View>
      );
    }
  };
  
  // 渲染右侧滑动菜单
  const renderRightActions = () => {
    return (
      <TouchableOpacity 
        style={styles.deleteAction} 
        onPress={() => onDelete(item.id)}
      >
        <Text style={styles.deleteText}>删除</Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={cardStyle}>
        <View style={styles.leftContent}>
          {renderAvatar()}
          <View style={styles.textContent}>
            <Text style={nameStyle}>{item.name}</Text>
            <Text style={cityStyle}>{item.city} {item.flag}</Text>
          </View>
        </View>
        <View style={styles.rightContent}>
          <View style={styles.timeContainer}>
            <Text style={timeStyle}>{formattedTime}</Text>
            <Text style={styles.icon}>{dayNightIcon}</Text>
          </View>
          <Text style={offsetStyle}>{item.offset}</Text>
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    elevation: 2,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContent: {
    marginLeft: 12,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  city: {
    fontSize: 14,
  },
  time: {
    fontSize: 32,
    fontWeight: '700',
    marginRight: 8,
    fontVariant: ['tabular-nums'],
  },
  icon: {
    fontSize: 18,
  },
  offset: {
    fontSize: 12,
  },
  // 删除按钮样式
  deleteAction: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
    width: 80,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});