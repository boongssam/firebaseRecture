# PDF 활동지 AI 평가 앱 만들기 · 연수 안내서

연수 참가자가 코딩, GitHub 업로드, Firebase App Hosting 배포를 따라 할 수 있는 **연수용 웹페이지**입니다. 이 저장소는 안내서 사이트이며, 실제 PDF 평가 앱은 참가자가 각자 만듭니다.

## 내 컴퓨터에서 웹페이지 열기

이 폴더(`Recture`)에서 터미널을 열고 실행합니다.

```powershell
npm.cmd install
npm.cmd run dev
```

터미널에 표시되는 로컬 주소(보통 `http://127.0.0.1:5173/`)를 브라우저에서 엽니다. macOS나 Linux에서는 `npm.cmd` 대신 `npm`을 사용합니다. 서버를 멈출 때는 터미널에서 `Ctrl+C`를 누릅니다.

## 연수 내용 수정하기

1. GitHub에서 [`index.md`](index.md)를 엽니다.
2. 연필 모양 **Edit this file**을 눌러 글을 수정합니다.
3. **Commit changes**를 누릅니다. GitHub Actions가 새 내용을 웹페이지로 빌드하고 게시합니다.

제목과 소개 문구는 `index.md` 맨 위의 `title`, `description`을 바꿉니다. 본문에서 `##`로 시작하는 큰 제목은 목차에 자동 반영됩니다. 현재 여섯 개의 큰 제목 순서는 유지하면 상단의 단계 버튼도 그대로 연결됩니다.

| 파일 | 역할 |
| --- | --- |
| `index.md` | 연수 내용, 링크, 명령어, 평가 기준 |
| `index.html` | 사이트 화면 구조 |
| `assets/site.css` | 색상과 반응형 디자인 |
| `assets/site.js` | 목차, 코드 복사 버튼, 체크 목록 |
| `src/main.js` | 마크다운을 웹페이지로 표시 |
| `.github/workflows/pages.yml` | GitHub Pages 자동 게시 |

## GitHub Pages에 게시하기

1. 이 폴더를 **안내서용 GitHub 저장소**에 올립니다. 강사용 앱 예시 저장소 `boongssam/firebaseRecture`와 구분해 만드세요.
2. 저장소의 **Settings → Pages → Build and deployment**에서 **GitHub Actions**를 게시 방식으로 선택합니다.
3. `main` 브랜치에 변경 사항을 올리면 `pages.yml`이 `npm ci`와 `npm run build`를 실행해 웹페이지를 게시합니다.
4. **Actions**에서 게시가 끝났는지 확인하고, **Pages**에 표시된 주소를 엽니다.

> 참가자가 만드는 앱의 Firebase App Hosting 배포와 이 안내서의 GitHub Pages 배포는 서로 다른 작업입니다.

## 내용 작성 규칙

- 큰 단계는 `##`, 단계 안 설명은 `###`으로 시작합니다.
- 명령어는 세 개의 백틱으로 감싼 코드 블록에 적으면 복사 버튼이 붙습니다.
- `- [ ]`로 작성한 완료 항목은 방문자의 브라우저에서 체크할 수 있습니다.
- Gemini API 키와 학생의 실제 활동지 파일은 이 저장소에 올리지 않습니다.

공식 문서: [GitHub Pages 사용자 지정 워크플로](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [GitHub 웹에서 파일 수정](https://docs.github.com/en/repositories/working-with-files/managing-files)
