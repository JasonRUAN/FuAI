/**
 * 图片生成配置管理Hook
 * 
 * 提供完整的配置状态管理、用户偏好保存、预设加载等功能
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  ImageGenerationConfig,
  ConfigPreset,
  ConfigHistory,
  UserPreferences,
  ConfigValidationResult,
} from '../types/image-generation'
import {
  defaultImageConfig,
  configPresets,
  mapLegacyStyleToArtStyle,
  mapToneToColorScheme,
} from '../lib/image-generation-config'

// ==================== 本地存储键名 ====================

const STORAGE_KEYS = {
  USER_PREFERENCES: 'image-generation-preferences',
  CONFIG_HISTORY: 'image-generation-history',
  CURRENT_CONFIG: 'image-generation-current',
} as const

// ==================== Hook主体 ====================

export function useImageConfig() {
  // ==================== 状态管理 ====================
  
  const [config, setConfig] = useState<ImageGenerationConfig>(defaultImageConfig)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  // 用户偏好和历史记录
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    defaultConfig: {},
    favoritePresets: [],
    recentConfigs: [],
    preferences: {
      autoSave: true,
      showPreview: true,
      quickGenerate: false,
      saveHistory: true,
    },
  })
  
  const [configHistory, setConfigHistory] = useState<ConfigHistory[]>([])

  // ==================== 初始化 ====================
  
  useEffect(() => {
    loadUserPreferences()
    loadConfigHistory()
    loadCurrentConfig()
  }, [])

  // ==================== 本地存储操作 ====================
  
  const loadUserPreferences = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)
      if (saved) {
        const preferences = JSON.parse(saved) as UserPreferences
        setUserPreferences(prev => ({ ...prev, ...preferences }))
        
        // 如果有默认配置，应用到当前配置
        if (preferences.defaultConfig && Object.keys(preferences.defaultConfig).length > 0) {
          setConfig(prev => ({ ...prev, ...preferences.defaultConfig }))
        }
      }
    } catch (error) {
      console.error('加载用户偏好失败:', error)
    }
  }, [])

  const saveUserPreferences = useCallback((preferences: Partial<UserPreferences>) => {
    try {
      const updated = { ...userPreferences, ...preferences }
      setUserPreferences(updated)
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated))
    } catch (error) {
      console.error('保存用户偏好失败:', error)
    }
  }, [userPreferences])

  const loadConfigHistory = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG_HISTORY)
      if (saved) {
        const history = JSON.parse(saved) as ConfigHistory[]
        setConfigHistory(history)
      }
    } catch (error) {
      console.error('加载配置历史失败:', error)
    }
  }, [])

  const saveConfigHistory = useCallback((history: ConfigHistory[]) => {
    try {
      setConfigHistory(history)
      localStorage.setItem(STORAGE_KEYS.CONFIG_HISTORY, JSON.stringify(history))
    } catch (error) {
      console.error('保存配置历史失败:', error)
    }
  }, [])

  const loadCurrentConfig = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_CONFIG)
      if (saved) {
        const currentConfig = JSON.parse(saved) as ImageGenerationConfig
        setConfig(currentConfig)
      }
    } catch (error) {
      console.error('加载当前配置失败:', error)
    }
  }, [])

  const saveCurrentConfig = useCallback((configToSave: ImageGenerationConfig) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_CONFIG, JSON.stringify(configToSave))
    } catch (error) {
      console.error('保存当前配置失败:', error)
    }
  }, [])

  // ==================== 配置操作 ====================
  
  const updateConfig = useCallback((updates: Partial<ImageGenerationConfig>) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates }
      
      // 自动保存当前配置
      if (userPreferences.preferences.autoSave) {
        saveCurrentConfig(newConfig)
      }
      
      setHasUnsavedChanges(true)
      return newConfig
    })
    
    setError(null)
  }, [userPreferences.preferences.autoSave, saveCurrentConfig])

  const resetConfig = useCallback(() => {
    setConfig(defaultImageConfig)
    setHasUnsavedChanges(false)
    setError(null)
  }, [])

  const loadPreset = useCallback((presetId: string) => {
    const preset = configPresets.find(p => p.id === presetId)
    if (preset) {
      const newConfig = { ...config, ...preset.config }
      setConfig(newConfig)
      setHasUnsavedChanges(true)
      
      if (userPreferences.preferences.autoSave) {
        saveCurrentConfig(newConfig)
      }
    }
  }, [config, userPreferences.preferences.autoSave, saveCurrentConfig])

  const saveAsPreset = useCallback((name: string, description: string) => {
    const newPreset: ConfigPreset = {
      id: `custom-${Date.now()}`,
      name,
      description,
      config,
      tags: ['自定义'],
    }
    
    // 这里可以扩展为保存到服务器或本地存储
    console.log('保存自定义预设:', newPreset)
    return newPreset
  }, [config])

  // ==================== 历史记录操作 ====================
  
  const addToHistory = useCallback((imageUrl?: string) => {
    if (!userPreferences.preferences.saveHistory) return
    
    const historyItem: ConfigHistory = {
      id: `history-${Date.now()}`,
      timestamp: Date.now(),
      config,
      imageUrl,
      isBookmarked: false,
    }
    
    const newHistory = [historyItem, ...configHistory].slice(0, 50) // 最多保存50条
    saveConfigHistory(newHistory)
  }, [config, configHistory, userPreferences.preferences.saveHistory, saveConfigHistory])

  const loadFromHistory = useCallback((historyId: string) => {
    const historyItem = configHistory.find(h => h.id === historyId)
    if (historyItem) {
      setConfig(historyItem.config)
      setHasUnsavedChanges(true)
    }
  }, [configHistory])

  const toggleBookmark = useCallback((historyId: string) => {
    const newHistory = configHistory.map(item =>
      item.id === historyId
        ? { ...item, isBookmarked: !item.isBookmarked }
        : item
    )
    saveConfigHistory(newHistory)
  }, [configHistory, saveConfigHistory])

  const clearHistory = useCallback(() => {
    saveConfigHistory([])
  }, [saveConfigHistory])

  // ==================== 配置验证 ====================
  
  const validateConfig = useCallback((configToValidate: ImageGenerationConfig): ConfigValidationResult => {
    const errors: ConfigValidationResult['errors'] = []
    const warnings: ConfigValidationResult['warnings'] = []

    // 基础验证
    if (!configToValidate.artStyle) {
      errors.push({ field: 'artStyle', message: '请选择画风类型' })
    }
    
    if (!configToValidate.layout) {
      errors.push({ field: 'layout', message: '请选择构图布局' })
    }
    
    if (!configToValidate.colorScheme) {
      errors.push({ field: 'colorScheme', message: '请选择色调方案' })
    }

    // 兼容性警告
    if (configToValidate.artStyle === 'traditional-ink' && configToValidate.colorScheme === 'vibrant') {
      warnings.push({
        field: 'colorScheme',
        message: '传统水墨画风格建议使用单色调或优雅色彩'
      })
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }, [])

  // ==================== 兼容性处理 ====================
  
  const migrateFromLegacyConfig = useCallback((legacyConfig: {
    style?: string
    tone?: string
    zodiac?: string
    theme?: string
  }) => {
    const migratedConfig: Partial<ImageGenerationConfig> = {
      ...config,
    }

    // 映射旧的风格到新的画风
    if (legacyConfig.style) {
      const artStyleOption = mapLegacyStyleToArtStyle(legacyConfig.style)
      migratedConfig.artStyle = artStyleOption.value
    }

    // 映射氛围到色调
    if (legacyConfig.tone) {
      const colorSchemeOption = mapToneToColorScheme(legacyConfig.tone)
      migratedConfig.colorScheme = colorSchemeOption.value
    }

    // 保持现有配置
    if (legacyConfig.zodiac) migratedConfig.zodiac = legacyConfig.zodiac
    if (legacyConfig.theme) migratedConfig.theme = legacyConfig.theme

    updateConfig(migratedConfig)
  }, [config, updateConfig])

  // ==================== 计算属性 ====================
  
  const validation = useMemo(() => validateConfig(config), [config, validateConfig])
  
  const isValid = useMemo(() => validation.isValid, [validation])
  
  const favoritePresets = useMemo(() => 
    configPresets.filter(preset => userPreferences.favoritePresets.includes(preset.id)),
    [userPreferences.favoritePresets]
  )
  
  const recentHistory = useMemo(() => 
    configHistory.slice(0, 10),
    [configHistory]
  )
  
  const bookmarkedHistory = useMemo(() => 
    configHistory.filter(item => item.isBookmarked),
    [configHistory]
  )

  // ==================== 返回接口 ====================
  
  return {
    // 配置状态
    config,
    isLoading,
    error,
    hasUnsavedChanges,
    isValid,
    validation,
    
    // 配置操作
    updateConfig,
    resetConfig,
    loadPreset,
    saveAsPreset,
    
    // 历史记录
    configHistory,
    recentHistory,
    bookmarkedHistory,
    addToHistory,
    loadFromHistory,
    toggleBookmark,
    clearHistory,
    
    // 用户偏好
    userPreferences,
    saveUserPreferences,
    favoritePresets,
    
    // 工具函数
    validateConfig,
    migrateFromLegacyConfig,
    
    // 预设数据
    availablePresets: configPresets,
  }
}

// ==================== 类型导出 ====================

export type UseImageConfigReturn = ReturnType<typeof useImageConfig>