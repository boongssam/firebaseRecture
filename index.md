---
title: Firebase로 웹만들기 속성 연수!
description: 코딩 → GitHub 업로드 → Firebase 배포까지, 처음 하는 분도 순서대로 따라 할 수 있도록! → NWES26 바이브코딩 공모전에 출품하기!
---

## 오늘의 활동 순서

이번 연수에서는 **학생 활동지를 PDF로 업로드하고, 정해 둔 기준에 따라 AI가 평가 결과를 제안하는 웹 앱**을 만들어 봅니다. 완성한 앱을 로컬에서 확인한 다음, 각자의 GitHub 저장소에 올리고 Firebase App Hosting으로 배포합니다.

1. **코딩하기** — 앱을 만들고 Firebase와 Gemini를 연결합니다.
2. **GitHub에 업로드하기** — 각자 만든 저장소에 코드를 올립니다.
3. **Firebase로 배포하기** — App Hosting에서 저장소를 연결하고 작동을 확인합니다.

> **오늘의 결과물** 로그인, 평가 기준 입력, PDF 업로드, AI 분석, 평가 결과 저장·조회가 가능한 앱의 배포 주소

## 준비 사항

- [Node.js](https://nodejs.org/)와 [Git](https://git-scm.com/downloads)을 설치합니다. 설치 뒤 터미널에서 아래 명령어로 버전을 확인합니다.
- [GitHub](https://github.com/) 계정과 [Firebase](https://console.firebase.google.com/) 프로젝트를 사용할 Google 계정을 준비합니다.
- [VS Code](https://code.visualstudio.com/) 또는 Antigravity IDE처럼 코드를 편집하고 터미널을 열 수 있는 도구를 준비합니다.
- 배포용 비밀값을 설정할 때 사용할 [Firebase CLI](https://firebase.google.com/docs/cli)를 설치할 수 있도록 준비합니다.
- Gemini API 키를 발급받고, 시험에 사용할 **개인정보가 없는 예시 PDF**를 준비합니다.
- Firebase App Hosting 및 Cloud Storage 사용을 위해 Firebase 프로젝트의 **Blaze 요금제와 결제 설정**을 확인합니다. 실제 사용량에 따라 비용이 발생할 수 있습니다.

```bash
node -version
git --version
```

> **먼저 확인** 명령어에 버전 번호가 나타나지 않으면 설치를 마친 뒤 터미널을 다시 열어 보세요. 이 안내서의 `npm.cmd`는 Windows PowerShell 기준입니다. macOS나 Linux에서는 `npm`을 사용하세요.

## 1. 코딩하기

### 1-1. AI 코딩 도구에 앱 요구 사항 전달하기

VS Code 또는 Antigravity IDE에서 새 프로젝트를 시작합니다. Firebase App Hosting에서 배포할 계획이라면 **Next.js 앱**으로 만들도록 요청하면 연수 과정을 따라가기 쉽습니다. 아래 문장을 출발점으로 사용하고, 생성된 코드를 한 단계씩 실행해 확인합니다.

```text
Next.js로 학생 활동지 PDF를 AI로 평가하는 웹 앱을 만들어 줘.
교사는 로그인하고 평가 기준을 입력·수정할 수 있어야 해.
PDF 파일을 업로드하면 Gemini가 문서를 읽고 기준별 점수, 판단 근거,
개선 제안을 보여 줘. PDF는 Firebase Cloud Storage에,
평가 기준과 결과는 Cloud Firestore에 저장해 줘.
Gemini API 호출과 API 키 사용은 서버에서만 처리해 줘.
Firebase App Hosting으로 배포할 수 있게 구성해 줘.
```

- 한 번에 모든 기능을 확인하려 하지 말고 **로그인 → 기준 저장 → PDF 업로드 → AI 평가 → 결과 저장** 순서로 점검합니다.
- AI가 만든 코드라도 어떤 파일이 어떤 역할을 하는지 확인하고, 오류가 나면 오류 메시지와 해당 파일을 함께 전달해 수정합니다.
- 학생 이름, 학번 등 개인정보가 담긴 실제 활동지는 연수 실습에 사용하지 않습니다.

### 1-2. Firebase 프로젝트와 데이터 저장소 준비하기

- **Authentication**: 교사 로그인에 사용합니다. 사용할 로그인 방법을 Firebase 콘솔에서 활성화합니다.
- **Cloud Firestore**: 평가 기준, 평가 결과, 작성 시각 등의 데이터를 저장합니다.
- **Cloud Storage**: 업로드한 PDF 파일을 저장합니다. PDF 원본을 Firestore 문서에 직접 넣지 않습니다.
- **App Hosting**: GitHub에 코드를 올린 뒤 저장소를 연결해 앱을 배포합니다.
- Authentication, Firestore, Storage의 접근 규칙을 확인해 다른 사람이 학생 파일이나 평가 결과를 임의로 볼 수 없도록 합니다.

### 1-3. Firebase 설정값과 Gemini API 키 연결하기

Firebase 웹 앱을 등록하고 앱 설정값을 확인합니다. 개발 중에는 프로젝트의 `.env.local`에 필요한 환경 변수를 넣습니다. 변수 이름은 실제로 생성한 앱 코드와 일치해야 합니다.

- **`.env.local`**: 내 컴퓨터에서 앱을 실행할 때 읽는 설정 파일입니다. Gemini API 키가 들어간다면 GitHub에 올리지 않습니다.
- **`apphosting.yaml`**: 배포 환경의 설정을 지정하는 파일입니다. GitHub에 올릴 수 있지만 **Gemini API 키 값 자체는 넣지 않습니다.**
- **Secret Manager**: 배포용 Gemini API 키의 실제 값을 저장합니다. `apphosting.yaml`에는 그 비밀값의 이름만 참조합니다.
- **Firebase 웹 앱 설정값**과 **Gemini API 키**는 역할이 다릅니다. 특히 Gemini API 키는 브라우저 코드에 노출되지 않도록 서버에서만 읽습니다.

예를 들어 배포용 비밀값을 `geminiApiKey`라는 이름으로 만들었다면 YAML에는 다음처럼 **참조만** 적습니다.

```yaml
env:
  - variable: GEMINI_API_KEY
    secret: geminiApiKey
```

> **꼭 확인** `.gitignore`에 `.env.local`이 포함되어 있는지 확인하세요. 키를 GitHub에 올렸다면 파일을 지우는 것만으로 끝내지 말고 해당 키도 새로 발급받아야 합니다.

### 1-4. 평가 기준 입력하기

앱의 평가 기준 입력 화면에서 아래 항목을 넣어 봅니다. AI 평가 결과에는 가능하면 **기준별 점수, 판단 근거, 개선 제안**을 함께 표시하게 합니다.

| 평가 기준 | 확인할 내용 |
| --- | --- |
| 주제의 명확성 | 글 전체를 관통하는 중심 생각이나 핵심 메시지가 분명한가? |
| 목적 달성도 | 글을 쓴 의도(설득, 정보 전달, 정서 표현 등)가 효과적으로 실현되었는가? |
| 분량 | 글쓰기 결과가 한글 200자 이상인가? |

> **분량 기준** ‘한글 200자’와 ‘600바이트’는 항상 같은 뜻이 아닙니다. 이번 실습은 **글자 수 200자 이상**으로 통일합니다. 글자 수를 세는 방식도 앱에서 정해 두세요.

### 1-5. 로컬에서 작동 확인하기

```bash
npm run dev
```

터미널에 표시된 로컬 주소를 열고 다음을 순서대로 확인합니다.

1. 교사 계정으로 **로그인**할 수 있는가?
2. 평가 기준을 **입력·수정·저장**할 수 있는가?
3. 예시 PDF를 **업로드**하고 내용이 추출·분석되는가?
4. 기준별 평가와 개선 제안이 화면에 보이는가?
5. 새로고침한 뒤에도 평가 기준과 결과가 남아 있는가?
6. Firebase 콘솔에서 PDF는 **Storage**, 기준과 결과는 **Firestore**에 저장된 것을 확인했는가?

> **AI 결과 검토** AI의 평가는 참고용입니다. 결과의 타당성을 교사가 확인하고, 학생에게 제공할 피드백은 필요에 따라 수정하세요.

경고가 나오면?
npm : 이 시스템에서 스크립트를 실행할 수 없으므로 C:\Program Files\nodejs\npm.ps1 파일을 로드할 수 없습니다. 자세한 내용은 about_Execution_Policies(https://go.microsoft.com/fw
link/?LinkID=135170)를 참조하십시오.

```bash
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```


## 2. GitHub에 코드 업로드

### 2-1. 내 저장소 만들기

GitHub에서 **각자 새 저장소**를 만듭니다. 강사용 예시 저장소인 [`boongssam/firebaseRecture`](https://github.com/boongssam/firebaseRecture)는 참고용이며, 아래 명령어의 주소는 **본인 저장소 주소**로 바꿉니다.

### 2-2. 비밀 파일을 제외하고 업로드하기

프로젝트 루트의 `.gitignore`에 최소한 다음 항목이 있는지 확인합니다.

```gitignore
node_modules/
.next/
.env.local
.env.*.local
```

터미널에서 프로젝트 폴더로 이동한 뒤 순서대로 실행합니다. 기존에 Git 저장소가 이미 만들어져 있다면 `git init`은 생략해도 됩니다.

```bash
git init
git status
git add .
git status
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/내아이디/내저장소.git
git push -u origin main
```

- 두 번째 `git status`에서 `.env.local`이나 API 키가 들어간 파일이 업로드 목록에 없는지 확인합니다.
- `git add README.md`만 실행하면 앱 코드가 빠질 수 있어 이 안내서에서는 `git add .`을 사용합니다.
- 이미 `origin` 연결이 있다면 `git remote add origin`을 반복하지 말고 `git remote -v`로 주소를 확인합니다.

## 3. Firebase App Hosting으로 배포

### 3-1. GitHub 저장소 연결하기

Firebase 콘솔의 **App Hosting**에서 백엔드를 만들고 **본인 GitHub 저장소**를 연결합니다. 앱이 있는 폴더, 배포할 브랜치(`main`), 리전을 확인합니다. 자동 배포를 켜면 이후 `main`에 변경 사항을 올릴 때 새 버전이 배포됩니다.

### 3-2. 배포 환경 설정하기

- 로컬의 `.env.local`은 배포 서버로 자동 복사되는 파일이 아닙니다.
- Firebase 프로젝트 설정값과 환경 변수는 생성한 앱의 방식에 맞춰 App Hosting에 설정합니다.
- Gemini API 키는 Secret Manager에 저장하고, `apphosting.yaml`에서는 비밀값을 참조합니다.
- Firebase 콘솔에서 배포 진행 상태와 빌드 오류 메시지를 확인합니다.

Windows PowerShell에서 Firebase CLI를 설치하고 로그인한 다음, 앞에서 YAML에 적은 이름으로 비밀값을 만듭니다. 마지막 명령에서 **본인 Firebase 프로젝트 ID**로 바꾸고, API 키 값은 터미널의 입력 안내에 따라 넣습니다.

```bash
npm.cmd install -g firebase-tools
firebase.cmd login
firebase.cmd apphosting:secrets:set geminiApiKey --project 내프로젝트ID
```

설정 후 App Hosting에서 해당 비밀값에 접근할 권한과 새 배포 상태를 확인합니다. macOS나 Linux에서는 명령어의 `.cmd`를 빼고 실행합니다.

### 3-3. 배포 주소에서 다시 시험하기

1. 배포 주소가 정상적으로 열리는가?
2. 로그인과 로그아웃이 되는가?
3. 평가 기준을 생성·조회·수정·삭제할 수 있는가?
4. PDF 업로드와 AI 분석이 되는가?
5. 평가 결과를 저장·조회·수정·삭제할 수 있는가?
6. 다른 사용자에게 학생 파일이나 결과가 노출되지 않는가?

> **로컬과 배포는 다릅니다.** 내 컴퓨터에서 성공했더라도 배포 주소에서 로그인, 비밀값, 저장 권한을 다시 확인해야 합니다.

## 완료 점검

- [ ] 앱 코드를 본인 GitHub 저장소에 올렸다.
- [ ] `.env.local`과 Gemini API 키 값은 GitHub에 올리지 않았다.
- [ ] Firebase App Hosting 배포 주소를 확인했다.
- [ ] 로그인, PDF 업로드, 평가 기준, AI 결과 저장이 배포 주소에서 작동한다.
- [ ] 학생 자료 접근 권한과 AI 평가 결과를 교사가 확인했다.

### 공식 참고 자료

- [Firebase App Hosting 시작하기](https://firebase.google.com/docs/app-hosting/get-started)
- [App Hosting 환경 변수와 비밀값 설정](https://firebase.google.com/docs/app-hosting/configure)
- [Firebase Cloud Storage 파일 업로드](https://firebase.google.com/docs/storage/web/upload-files)
- [Gemini API의 PDF 처리](https://ai.google.dev/gemini-api/docs/document-processing)
- [Gemini API 키 보안 안내](https://ai.google.dev/gemini-api/docs/api-key)
