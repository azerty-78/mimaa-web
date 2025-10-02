# 📊 Guide du Diagramme de Progression de Grossesse

## 🎯 **Comment le Diagramme s'adapte automatiquement**

Le diagramme de progression (60% dans votre exemple) se calcule automatiquement selon cette formule :

```typescript
percent = Math.min(100, Math.max(0, Math.round(((record?.currentWeek || 0) / 40) * 100)))
```

### 📋 **Formule de Calcul :**
- **Pourcentage = (Semaine actuelle ÷ 40) × 100**
- **Maximum : 100%** (grossesse à terme)
- **Minimum : 0%** (début de grossesse)

## 🔧 **Informations Médicales à Modifier**

### 1. **`currentWeek` (Semaine actuelle) - PRINCIPAL**
```json
{
  "currentWeek": 24  // ← Cette valeur détermine le pourcentage
}
```

**Impact :** 
- 24 semaines = 60% (24/40 × 100)
- 20 semaines = 50% (20/40 × 100)
- 30 semaines = 75% (30/40 × 100)

### 2. **`dueDate` (Date Prévue d'Accouchement) - SECONDAIRE**
```json
{
  "dueDate": "2025-11-17"  // ← Affiché dans l'interface
}
```

**Impact :** Affiché dans la case "DPA" mais n'influence pas le calcul du pourcentage

### 3. **`lastMenstrualPeriod` (Dernières Règles) - CALCUL AUTOMATIQUE**
```json
{
  "lastMenstrualPeriod": "2025-03-03"  // ← Peut être utilisé pour calculer currentWeek
}
```

**Impact :** Peut servir à calculer automatiquement `currentWeek` si non fourni

## 🛠️ **Comment Modifier les Données**

### **Option 1 : Modification Directe (Recommandée)**
```typescript
// Dans l'interface utilisateur ou via API
const updatePregnancyRecord = async (userId: number, updates: Partial<PregnancyRecord>) => {
  await pregnancyApi.update(userId, {
    currentWeek: 28,  // ← Modifier cette valeur
    dueDate: "2025-12-15",  // ← Optionnel
    // ... autres champs
  });
};
```

### **Option 2 : Calcul Automatique basé sur la DPA**
```typescript
// Calculer currentWeek à partir de dueDate
const calculateCurrentWeek = (dueDate: string) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  return Math.max(0, 40 - diffWeeks);
};

// Utilisation
const currentWeek = calculateCurrentWeek("2025-11-17");
// Si on est le 17/09/2025 et DPA = 17/11/2025
// currentWeek = 40 - 8 = 32 semaines = 80%
```

### **Option 3 : Calcul basé sur les Dernières Règles**
```typescript
// Calculer currentWeek à partir de lastMenstrualPeriod
const calculateFromLMP = (lastMenstrualPeriod: string) => {
  const lmp = new Date(lastMenstrualPeriod);
  const today = new Date();
  const diffTime = today.getTime() - lmp.getTime();
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  return Math.min(40, Math.max(0, diffWeeks));
};

// Utilisation
const currentWeek = calculateFromLMP("2025-03-03");
// Si on est le 17/09/2025 et LMP = 03/03/2025
// currentWeek = 28 semaines = 70%
```

## 📊 **Exemples de Progression**

| Semaine | Pourcentage | Trimestre | Description |
|---------|-------------|-----------|-------------|
| 4 | 10% | 1er | Découverte de grossesse |
| 12 | 30% | 1er | Fin du 1er trimestre |
| 20 | 50% | 2ème | Milieu de grossesse |
| 24 | 60% | 2ème | **Votre cas actuel** |
| 28 | 70% | 3ème | Début du 3ème trimestre |
| 32 | 80% | 3ème | 8 semaines restantes |
| 36 | 90% | 3ème | 4 semaines restantes |
| 40 | 100% | 3ème | Terme de grossesse |

## 🔄 **Mise à Jour Automatique**

### **Dans l'Interface Utilisateur :**
1. **Page de Profil** : Modifier `currentWeek`
2. **Dashboard** : Bouton "Rafraîchir" pour recalculer
3. **API** : Mise à jour via `pregnancyApi.update()`

### **Code de Mise à Jour :**
```typescript
// Dans PregnancyDashboardPage.tsx
const refresh = async () => {
  if (!user) return;
  try {
    setRefreshing(true);
    const [pr, appts] = await Promise.all([
      pregnancyApi.getByUserId(user.id),
      appointmentApi.getByUserId(user.id),
    ]);
    setRecord(pr);  // ← Recharge les données
    setAppointments(appts || []);
  } finally {
    setRefreshing(false);
  }
};
```

## 🎨 **Personnalisation du Diagramme**

### **Couleurs et Style :**
```typescript
// Dans CircularProgress component
<circle 
  cx="50" cy="50" r="45" 
  stroke="#ec4899"  // ← Couleur rose
  strokeWidth="10" 
  fill="none" 
  strokeLinecap="round" 
  strokeDasharray={`${Math.PI * 2 * 45}`} 
  strokeDashoffset={`${Math.PI * 2 * 45 * (1 - percent/100)}`} 
/>
```

### **Modifier les Couleurs :**
- **Rose** : `#ec4899` (actuel)
- **Bleu** : `#3b82f6`
- **Vert** : `#10b981`
- **Violet** : `#8b5cf6`

## 🚀 **Fonctionnalités Avancées**

### **1. Calcul Intelligent :**
```typescript
const calculateSmartWeek = (record: PregnancyRecord) => {
  // Priorité 1 : currentWeek si fourni
  if (record.currentWeek) return record.currentWeek;
  
  // Priorité 2 : Calcul depuis DPA
  if (record.dueDate) {
    return calculateCurrentWeek(record.dueDate);
  }
  
  // Priorité 3 : Calcul depuis LMP
  if (record.lastMenstrualPeriod) {
    return calculateFromLMP(record.lastMenstrualPeriod);
  }
  
  return 0; // Valeur par défaut
};
```

### **2. Validation des Données :**
```typescript
const validatePregnancyData = (record: PregnancyRecord) => {
  const errors = [];
  
  if (record.currentWeek < 0 || record.currentWeek > 42) {
    errors.push("Semaine de grossesse invalide (0-42)");
  }
  
  if (record.dueDate && new Date(record.dueDate) < new Date()) {
    errors.push("Date d'accouchement dans le passé");
  }
  
  return errors;
};
```

### **3. Notifications de Progression :**
```typescript
const getProgressMessage = (week: number) => {
  if (week >= 40) return "🎉 Félicitations ! Bébé est arrivé !";
  if (week >= 36) return "🏠 Préparez-vous, c'est bientôt !";
  if (week >= 28) return "👶 Troisième trimestre en cours";
  if (week >= 20) return "🤰 Mi-grossesse atteinte !";
  if (week >= 12) return "🌸 Premier trimestre terminé";
  return "🌱 Début de grossesse";
};
```

## ✅ **Résumé**

**Pour faire évoluer le diagramme automatiquement :**

1. **Modifiez `currentWeek`** dans les données de grossesse
2. **Le pourcentage se calcule automatiquement** : `(currentWeek / 40) × 100`
3. **Le diagramme se met à jour** en temps réel
4. **Utilisez le bouton "Rafraîchir"** pour forcer la mise à jour

**Exemple concret :**
- **Actuellement** : 24 semaines = 60%
- **Pour 30 semaines** : Modifier `currentWeek: 30` → 75%
- **Pour 35 semaines** : Modifier `currentWeek: 35` → 87.5%

Le diagramme s'adaptera automatiquement ! 🎯
