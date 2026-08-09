소규모 iPhone 홈 화면 웹앱
============================

구성 파일
- index.html                  : 실제 웹앱 화면
- manifest.webmanifest        : 앱 이름/아이콘/홈 화면 설정
- icons/                      : Android 물방울과 같은 디자인의 아이콘
- apps_script.gs              : Google Drive notice.txt를 읽어 주는 무료 중계 코드
- .nojekyll                   : GitHub Pages에서 파일을 그대로 제공하도록 하는 설정

중요
이 웹앱은 Android 앱과 동일한 Google Drive 파일 ID를 사용합니다.
Google Drive 파일 ID:
1ibHb5O7LQ1HXn69VMzJZNsBiVYqhdLK_

왜 Google Apps Script가 필요한가?
웹브라우저는 다른 사이트(Google Drive)의 파일을 JavaScript로 직접 읽는 것을
CORS 보안 정책으로 막을 수 있습니다. 그래서 Google Apps Script가 Drive 파일을
읽고, GitHub Pages 웹앱에 텍스트만 전달하게 구성했습니다.
비용은 들지 않습니다.

[1단계] Google Apps Script 중계 주소 만들기
1. 웹브라우저에서 https://script.google.com/ 접속
2. Google 계정 로그인
3. 새 프로젝트 클릭
4. 기본으로 있는 Code.gs 내용을 전부 삭제
5. 이 ZIP의 apps_script.gs 내용을 전부 복사해서 붙여넣기
6. 저장(Ctrl+S)
7. 오른쪽 위 '배포' -> '새 배포'
8. 유형 선택(톱니바퀴) -> '웹 앱'
9. 실행 사용자: 나
10. 액세스 권한: 모든 사용자(화면 표현에 따라 'Anyone')
11. 배포 클릭
12. Google 권한 요청이 나오면 허용
13. 표시되는 '웹 앱 URL'을 복사
    반드시 끝이 /exec 인 주소를 사용

[2단계] index.html에 Apps Script 주소 넣기
1. index.html을 메모장으로 열기
2. 다음 줄을 찾기
   const PROXY_URL = "PUT_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
3. 따옴표 안을 방금 복사한 /exec 주소로 교체
예:
   const PROXY_URL = "https://script.google.com/macros/s/XXXXXXXXXXXX/exec";
4. 저장

[3단계] GitHub Pages에 올리기
1. https://github.com/ 에서 계정 생성/로그인
2. 오른쪽 위 + -> New repository
3. Repository name: sogyumo
4. Public 선택
5. Create repository
6. 저장소 화면에서 'uploading an existing file' 또는 Add file -> Upload files
7. 이 폴더 안의 파일들을 업로드
   index.html
   manifest.webmanifest
   .nojekyll
   icons 폴더 안의 PNG 파일들
   (apps_script.gs와 이 설명 파일은 올리지 않아도 됨)
8. Commit changes 클릭
9. 저장소 상단 Settings 클릭
10. 왼쪽 Pages 클릭
11. Build and deployment -> Source에서 'Deploy from a branch' 선택
12. Branch: main, 폴더: /(root) 선택 후 Save
13. 잠시 후 Pages 화면에 사이트 주소가 표시됨
   일반적으로 https://사용자이름.github.io/sogyumo/ 형태

[4단계] iPhone 홈 화면에 설치
1. iPhone Safari에서 GitHub Pages 주소 열기
2. 공유 버튼 누르기
3. '홈 화면에 추가' 선택
4. '웹 앱으로 열기'가 보이면 켜기
5. 이름이 '소규모'인지 확인
6. 추가
7. 홈 화면에 물방울 아이콘의 '소규모'가 생김

동작
소규모 아이콘 터치
-> 흰 화면
-> 로딩중 / 로딩중. / 로딩중.. / 로딩중... (0.18초 간격)
-> Drive 텍스트를 받는 즉시 최신 내용 표시
-> 새로고침 버튼 없음
-> 다음 실행 시 다시 최신 내용 조회

주의
Google Apps Script를 수정한 경우 배포 관리에서 새 버전으로 업데이트해야 할 수 있습니다.
GitHub의 index.html만 수정한 경우 Commit하면 웹페이지가 다시 배포됩니다.
