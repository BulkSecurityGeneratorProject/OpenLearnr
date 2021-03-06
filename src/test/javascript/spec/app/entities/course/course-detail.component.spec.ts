/* tslint:disable max-line-length */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OpenLearnrTestModule } from '../../../test.module';
import { CourseDetailComponent } from 'app/entities/course/course-detail.component';
import { Course } from 'app/shared/model/course.model';
import { MatSnackBarModule } from '@angular/material';
import { HttpResponse } from '@angular/common/http';
import { ChapterService } from 'app/entities/chapter';
import { Chapter } from 'app/shared/model/chapter.model';
import { Video } from 'app/shared/model/video.model';
import { CommentService } from 'app/entities/comment';
import { Comment } from 'app/shared/model/comment.model';

describe('Component Tests', () => {
  describe('Course Management Detail Component', () => {
    let comp: CourseDetailComponent;
    let fixture: ComponentFixture<CourseDetailComponent>;
    let service: ChapterService;
    let commentService: CommentService;
    const route = ({ data: of({ course: new Course('123') }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OpenLearnrTestModule, MatSnackBarModule],
        declarations: [CourseDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(CourseDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CourseDetailComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ChapterService);
      commentService = fixture.debugElement.injector.get(CommentService);
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.course).toEqual(jasmine.objectContaining({ id: '123' }));
      });
    });

    describe('loadAllChaptersForCourse', () => {
      it('Should call getChaptersForCourse method of chapterService', fakeAsync(() => {
        // GIVEN
        comp.navItems = [];
        const course = new Course('myCourse');
        const chapters = [new Chapter('abc'), new Chapter('def'), new Chapter('ghi')];
        const videos = [new Video('xyz'), new Video('ref'), new Video('des')];
        videos[0].chapterID = 'abc';
        const comments = [new Comment('abc'), new Comment('def'), new Comment('ghi')];
        spyOn(service, 'getChaptersForCourse').and.returnValue(of(new HttpResponse({ body: chapters })));
        spyOn(service, 'getVideosForChapters').and.returnValue(of(new HttpResponse({ body: videos })));
        spyOn(commentService, 'getCommentsForVideo').and.returnValue(of(new HttpResponse({ body: comments })));

        // WHEN
        comp.loadAllChaptersForCourse(course);
        tick(); // simulate async

        // THEN
        expect(service.getChaptersForCourse).toHaveBeenCalledWith(course.id);
        expect(service.getVideosForChapters).toHaveBeenCalledWith(['abc', 'def', 'ghi']);
        expect(commentService.getCommentsForVideo).toHaveBeenCalledWith('xyz');
      }));
    });
  });
});
