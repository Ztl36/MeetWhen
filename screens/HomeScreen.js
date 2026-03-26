import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import TimeCard from '../components/TimeCard';

// 配置 dayjs 插件
dayjs.extend(utc);
dayjs.extend(timezone);

// 存储 Key
const STORAGE_KEY = '@meetwhen_timezone_list';

// 屏幕宽度
const { width } = Dimensions.get('window');

// 初始 mock 数据
const initialMockData = [
  { id: '1', name: '张三', city: '北京', timezone: 'Asia/Shanghai', offset: 'UTC+8', flag: '🇨🇳', avatarUrl: null },
];

// 备选城市数据源
const AVAILABLE_CITIES = [
  { name: '悉尼', timezone: 'Australia/Sydney', offset: 'UTC+10', flag: '🇦🇺' },
  { name: '巴黎', timezone: 'Europe/Paris', offset: 'UTC+1', flag: '🇫🇷' },
  { name: '迪拜', timezone: 'Asia/Dubai', offset: 'UTC+4', flag: '🇦🇪' },
  { name: '旧金山', timezone: 'America/Los_Angeles', offset: 'UTC-8', flag: '🇺🇸' },
  { name: '首尔', timezone: 'Asia/Seoul', offset: 'UTC+9', flag: '🇰🇷' },
];

export default function HomeScreen() {
  // 使用 useNavigation 和 useRoute 钩子
  const navigation = useNavigation();
  const route = useRoute();
  // 时钟状态
  const [now, setNow] = useState(dayjs());
  // 时间偏移状态
  const [offsetHours, setOffsetHours] = useState(0);
  // 时区列表状态
  const [timezoneList, setTimezoneList] = useState([]);
  // 加载状态
  const [isLoading, setIsLoading] = useState(true);
  // 弹窗显示状态
  const [isModalVisible, setModalVisible] = useState(false);
  // 搜索查询状态
  const [searchQuery, setSearchQuery] = useState('');
  // 联系人姓名状态
  const [personName, setPersonName] = useState('');
  
  // 每秒钟更新一次时间
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);
    
    // 组件卸载时清除 interval
    return () => clearInterval(interval);
  }, []);
  
  // 确保滑块初始位置在正中间
  useEffect(() => {
    // 使用 setTimeout 确保组件完全渲染后再设置状态
    const timer = setTimeout(() => {
      setOffsetHours(0);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 加载本地数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setTimezoneList(parsedData);
        } else {
          // 第一次打开App，使用空数组
          setTimezoneList([]);
          // 保存空数组到本地
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        }
      } catch (error) {
        console.error('加载数据失败:', error);
        // 出错时使用空数组
        setTimezoneList([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // 保存数据到本地
  useEffect(() => {
    const saveData = async () => {
      if (timezoneList.length > 0) {
        try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(timezoneList));
        } catch (error) {
          console.error('保存数据失败:', error);
        }
      }
    };
    
    saveData();
  }, [timezoneList]);
  
  // 监听路由参数变化，打开弹窗
  useEffect(() => {
    const { showModal } = route.params || {};
    if (showModal) {
      setModalVisible(true);
      // 重置搜索查询和姓名输入
      setSearchQuery('');
      setPersonName('');
      // 清除导航参数，避免重复触发
      navigation.setParams({ showModal: false });
    }
  }, [route.params, navigation]);
  
  // 计算调整后的时间
  const adjustedTime = now.add(offsetHours, 'hour');

  // 生成提示文案
  const getOffsetText = () => {
    if (offsetHours === 0) {
      return '当前时间';
    } else if (offsetHours > 0) {
      return `+${offsetHours} 小时`;
    } else {
      return `${offsetHours} 小时`;
    }
  };
  
  // 过滤城市列表
  const filteredCities = AVAILABLE_CITIES.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // 添加联系人的逻辑
  const addPerson = (city) => {
    // 校验姓名是否为空
    if (!personName.trim()) {
      Alert.alert('提示', '请先输入联系人姓名');
      return;
    }
    
    // 生成唯一 ID
    const newId = Date.now().toString();
    // 创建新联系人数据
    const newPersonData = {
      id: newId,
      name: personName.trim(),
      city: city.name,
      timezone: city.timezone,
      offset: city.offset,
      flag: city.flag,
      avatarUrl: null
    };
    // 添加到时区列表
    setTimezoneList(prev => [...prev, newPersonData]);
    // 关闭弹窗
    setModalVisible(false);
    // 重置状态
    setPersonName('');
    setSearchQuery('');
  };
  
  // 删除联系人的逻辑
  const handleDelete = (id) => {
    setTimezoneList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <SafeAreaView style={styles.container} bounces={false}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <FlatList
            data={timezoneList}
            renderItem={({ item }) => <TimeCard item={item} now={adjustedTime} onDelete={handleDelete} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
          />
          
          {/* 底部毛玻璃控制岛 */}
          <View style={styles.controlIslandContainer}>
            <BlurView intensity={80} tint="light" style={styles.blurContainer}>
              <Text style={styles.offsetText}>{getOffsetText()}</Text>
              {offsetHours !== 0 && (
                <TouchableOpacity onPress={() => setOffsetHours(0)} style={styles.resetButton}>
                  <Text style={styles.resetButtonText}>回到现在</Text>
                </TouchableOpacity>
              )}
              <Slider
                style={styles.slider}
                minimumValue={-24}
                maximumValue={24}
                step={1}
                value={offsetHours}
                onValueChange={setOffsetHours}
                minimumTrackTintColor="#007AFF"
                maximumTrackTintColor="rgba(0,0,0,0.1)"
                thumbTintColor="#FFFFFF"
              />
            </BlurView>
          </View>
        </View>
      )}
      
      {/* 添加城市弹窗 */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={false}
      >
        <SafeAreaView style={styles.modalContainer} bounces={false}>
          {/* 弹窗头部 */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelButton}>取消</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>添加联系人</Text>
            <View style={{ width: 50 }} />
          </View>
          
          {/* 姓名输入区 */}
          <View style={styles.nameInputContainer}>
            <TextInput
              style={styles.nameInput}
              placeholder="输入联系人姓名 (如: 客户A, 导师)"
              value={personName}
              onChangeText={setPersonName}
              autoCapitalize="none"
            />
          </View>
          
          {/* 搜索栏 */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="搜索城市名称..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          {/* 城市列表 */}
          <FlatList
            data={filteredCities}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.cityItem} 
                onPress={() => addPerson(item)}
              >
                <View style={styles.cityItemLeft}>
                  <Text style={styles.cityFlag}>{item.flag}</Text>
                  <Text style={styles.cityName}>{item.name}</Text>
                </View>
                <Text style={styles.cityOffset}>{item.offset}</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  contentContainer: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 16,
    paddingBottom: 120, // 为底部控制岛留出空间
  },
  // 底部控制岛容器
  controlIslandContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  // 毛玻璃容器
  blurContainer: {
    width: width * 0.9,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
  },
  // 偏移文字
  offsetText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3A3A3C',
    textAlign: 'center',
    marginBottom: 10,
  },
  // 重置按钮
  resetButton: {
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  resetButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  // 滑块
  slider: {
    width: '100%',
    height: 40,
  },
  // 加载指示器样式
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
  },
  // 弹窗样式
  modalContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalCancelButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  // 姓名输入区样式
  nameInputContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  nameInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    height: 50,
  },
  // 搜索栏样式
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
  },
  // 城市列表样式
  cityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  cityItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  cityName: {
    fontSize: 16,
    color: '#000000',
  },
  cityOffset: {
    fontSize: 14,
    color: '#8E8E93',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: 52,
  },
});